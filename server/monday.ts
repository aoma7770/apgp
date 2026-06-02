/**
 * Monday.com integration helper for APGP.
 * Syncs new provider registrations and profile updates to the
 * "APGP Accommodation Providers" board (ID: 18394069558)
 * in the "Ausnew Lead Gen 3.0" workspace.
 *
 * Uses the Monday.com GraphQL API directly with the API token
 * stored in MONDAY_API_TOKEN environment variable.
 */

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = 18394069558;
// Group: "APGP - Expression Of Interest Form Filled"
const GROUP_ID = "group_mkzb2cqm";

interface MondayColumnValues {
  organisationName: string;
  contactName?: string | null;
  contactTitle?: string | null;
  phone?: string | null;
  email: string;
  companyType?: string | null;
  regionsServiced?: string | null;
}

function buildColumnValues(data: MondayColumnValues): string {
  const cols: Record<string, unknown> = {};

  // text__1 → Name of the Main Contact
  if (data.contactName) cols["text__1"] = data.contactName;

  // text0 → Title / Position Of the Main Contact
  if (data.contactTitle) cols["text0"] = data.contactTitle;

  // phone → Phone Number Of Main Contact
  if (data.phone) cols["phone"] = { phone: data.phone, countryShortName: "AU" };

  // email → Email Of Main Contact
  cols["email"] = { email: data.email, text: data.email };

  // status → Type Of Company (SDA=0, Both=1, SIL=2)
  if (data.companyType) {
    const labelMap: Record<string, number> = { SDA: 0, Both: 1, SIL: 2 };
    const labelId = labelMap[data.companyType];
    if (labelId !== undefined) cols["status"] = { label: data.companyType };
  }

  // status__1 → Collaboration Status = "Expression Of Interest" (id:0)
  cols["status__1"] = { label: "Expression Of Interest" };

  // long_text4 → Property Suburb / Regions Serviced
  if (data.regionsServiced) cols["long_text4"] = { text: `Regions: ${data.regionsServiced}` };

  return JSON.stringify(cols);
}

async function mondayRequest(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.warn("[Monday] MONDAY_API_TOKEN not set — skipping sync");
    return null;
  }

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[Monday] API error:", response.status, text);
    throw new Error(`Monday.com API error: ${response.status}`);
  }

  const json = (await response.json()) as { data?: unknown; errors?: unknown[] };
  if (json.errors && json.errors.length > 0) {
    console.error("[Monday] GraphQL errors:", JSON.stringify(json.errors));
    throw new Error("Monday.com GraphQL error");
  }

  return json.data;
}

/**
 * Create a new item on the APGP Accommodation Providers board.
 * Returns the new Monday.com item ID.
 */
export async function createMondayProviderItem(data: MondayColumnValues): Promise<string | null> {
  try {
    const columnValues = buildColumnValues(data);
    const query = `
      mutation CreateItem($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
        create_item(
          board_id: $boardId
          group_id: $groupId
          item_name: $itemName
          column_values: $columnValues
        ) {
          id
        }
      }
    `;
    const variables = {
      boardId: String(BOARD_ID),
      groupId: GROUP_ID,
      itemName: data.organisationName || data.email,
      columnValues,
    };

    const result = (await mondayRequest(query, variables)) as { create_item?: { id: string } };
    const itemId = result?.create_item?.id ?? null;
    console.log("[Monday] Created provider item:", itemId);
    return itemId;
  } catch (err) {
    console.error("[Monday] Failed to create provider item:", err);
    return null;
  }
}

/**
 * Update an existing Monday.com item with fresh provider profile data.
 */
export async function updateMondayProviderItem(
  itemId: string,
  data: Partial<MondayColumnValues>
): Promise<void> {
  try {
    const cols: Record<string, unknown> = {};
    if (data.contactName) cols["text__1"] = data.contactName;
    if (data.contactTitle) cols["text0"] = data.contactTitle;
    if (data.phone) cols["phone"] = { phone: data.phone, countryShortName: "AU" };
    if (data.email) cols["email"] = { email: data.email, text: data.email };
    if (data.companyType) cols["status"] = { label: data.companyType };
    if (data.regionsServiced) cols["long_text4"] = { text: `Regions: ${data.regionsServiced}` };

    const query = `
      mutation UpdateItem($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
        change_multiple_column_values(
          board_id: $boardId
          item_id: $itemId
          column_values: $columnValues
        ) {
          id
        }
      }
    `;
    await mondayRequest(query, {
      boardId: String(BOARD_ID),
      itemId,
      columnValues: JSON.stringify(cols),
    });
    console.log("[Monday] Updated provider item:", itemId);
  } catch (err) {
    console.error("[Monday] Failed to update provider item:", err);
  }
}

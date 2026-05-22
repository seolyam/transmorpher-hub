/**
 * Validates Transmorpher TM1 loadout export strings (addon ↔ hub).
 * Mirrors transmorpher-addon/Transmorpher/Core/LoadoutCodec.lua
 */

const FORMAT_TAG = 'TM1';
const SLOT_COUNT = 14;

function countCommas(value: string): number {
  if (!value) return 0;
  return (value.match(/,/g) ?? []).length;
}

function looksLikeItemCsv(value: string | undefined): boolean {
  return !!value && countCommas(value) >= SLOT_COUNT - 2;
}

export function isValidLoadoutExportString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith(`${FORMAT_TAG}|`)) {
    return false;
  }

  const parts = trimmed.split('|');
  if (parts[0] !== FORMAT_TAG || parts.length < 8) {
    return false;
  }

  let itemsPart: string | undefined;
  if (parts[1] === '1') {
    if (parts[3] === '0' && looksLikeItemCsv(parts[4])) {
      itemsPart = parts[4];
    } else {
      itemsPart = parts[3];
    }
  } else if (parts[2] === '0' && looksLikeItemCsv(parts[3])) {
    itemsPart = parts[3];
  } else {
    itemsPart = parts[2];
  }

  if (!looksLikeItemCsv(itemsPart)) {
    return false;
  }

  return (itemsPart ?? '').split(',').every((token) => /^-?\d+$/.test(token));
}

export function loadoutExportHint(): string {
  return 'Paste a full TM1 string from the addon (Loadouts → Export). It must start with TM1|1| and include all item IDs.';
}

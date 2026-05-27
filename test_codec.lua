local ns = {}

ns.slotOrder = {
    "Head", "Shoulder", "Back", "Chest", "Shirt", "Tabard",
    "Wrist", "Hands", "Waist", "Legs", "Feet",
    "Main Hand", "Off-hand", "Ranged",
}
local function GetSlotCount() return 14 end

local FORMAT_TAG = "TM1"
local FORMAT_VERSION = "1"
local EMPTY_HIDDEN_MARKER = "-"

local function CountCommas(str)
    if not str then return 0 end
    local _, count = str:gsub(",", "")
    return count
end

local function LooksLikeItemCsv(str)
    if not str or str == "" then return false end
    if not str:match("^%-?%d") then
        return false
    end
    local minCommas = math.max(8, GetSlotCount() - 2)
    return CountCommas(str) >= minCommas
end

local function LooksLikeHiddenCsv(str)
    if not str or str == "" then return false end
    if not str:match("^%-?%d") then return false end
    return CountCommas(str) >= 3
end

local function EscapeName(str)
    if not str then return "Unnamed" end
    return str:gsub("|", "~")
end

local function UnescapeName(str)
    if not str then return "Unnamed" end
    return str:gsub("~", "|")
end

local function BuildItemsCsv(items, slotCount)
    local parts = {}
    for i = 1, slotCount do
        parts[i] = tostring((items and items[i]) or 0)
    end
    return table.concat(parts, ",")
end

local function BuildHiddenCsv(hiddenSlots, items, slotCount)
    local hiddenParts = {}
    local anyHidden = false
    for i = 1, slotCount do
        local hidden = (hiddenSlots and hiddenSlots[i]) and 1 or 0
        if items and items[i] and items[i] < 0 then
            hidden = 1
        end
        if hidden == 1 then anyHidden = true end
        hiddenParts[i] = tostring(hidden)
    end
    if anyHidden then
        return table.concat(hiddenParts, ",")
    end
    return EMPTY_HIDDEN_MARKER
end

local function SanitizeExportString(encoded)
    if not encoded then return encoded end
    return encoded:gsub("^TM1|1|([^|]+)|0|(%d)", "TM1|1|%1|%2", 1)
end

local function SplitPipe(encoded)
    local parts = {}
    local start = 1
    while true do
        local pos = encoded:find("|", start, true)
        if not pos then
            parts[#parts + 1] = encoded:sub(start)
            break
        end
        parts[#parts + 1] = encoded:sub(start, pos - 1)
        start = pos + 1
    end
    return parts
end

local function ParseItemList(str)
    local items = {}
    local slotCount = GetSlotCount()
    if not str or str == "" or slotCount < 1 then return items end
    local idx = 1
    for token in string.gmatch(str, "[^,]+") do
        if idx > slotCount then break end
        items[idx] = tonumber(token) or 0
        idx = idx + 1
    end
    return items
end

local function ParseHiddenList(str, items)
    local slotCount = GetSlotCount()
    local hiddenSlots = {}
    if str and str ~= "" and str ~= EMPTY_HIDDEN_MARKER then
        local idx = 1
        for token in string.gmatch(str, "[^,]+") do
            if idx > slotCount then break end
            if token == "1" then
                hiddenSlots[idx] = true
            end
            idx = idx + 1
        end
    end
    if items then
        for i = 1, slotCount do
            if items[i] and items[i] < 0 then
                hiddenSlots[i] = true
                items[i] = math.abs(items[i])
            end
        end
    end
    return hiddenSlots
end

local function FindItemsFieldIndex(parts, startIdx)
    for i = startIdx, #parts do
        if LooksLikeItemCsv(parts[i]) then
            return i
        end
    end
    return nil
end

local function ParseSpecialFields(parts, idx)
    if parts[idx] == "0" and parts[idx + 1] == "0" and parts[idx + 2] == "0" then
        local mountVal = tonumber(parts[idx + 3])
        if mountVal and mountVal > 0 then
            return "", "0", "0", parts[idx + 3], parts[idx + 4], parts[idx + 5],
                parts[idx + 6], parts[idx + 7], parts[idx + 8], parts[idx + 9], parts[idx + 10], parts[idx + 11]
        end
    end
    if parts[idx] == "0" and parts[idx + 1] == "0" then
        local mountVal = tonumber(parts[idx + 2])
        if mountVal and mountVal > 0 then
            return "", "0", "0", parts[idx + 2], parts[idx + 3], parts[idx + 4],
                parts[idx + 5], parts[idx + 6], parts[idx + 7], parts[idx + 8], parts[idx + 9], parts[idx + 10]
        end
    end
    return nil
end

local function SerializeLoadout(loadout)
    local slotCount = GetSlotCount()
    local name = EscapeName(loadout.name)
    local itemsCsv = BuildItemsCsv(loadout.items, slotCount)
    local hiddenCsv = BuildHiddenCsv(loadout.hiddenSlots, loadout.items, slotCount)

    local ms = 100
    if loadout.morphScale then ms = math.floor(loadout.morphScale * 100 + 0.5) end
    local hps = 100
    if loadout.combatPetScale then hps = math.floor(loadout.combatPetScale * 100 + 0.5) end

    local mountsCsv = ""
    local encoded = string.format(
        "%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s",
        FORMAT_TAG,
        FORMAT_VERSION,
        name,
        itemsCsv,
        hiddenCsv,
        tostring(loadout.enchantMH or 0),
        tostring(loadout.enchantOH or 0),
        tostring(loadout.mountDisplay or 0),
        loadout.mountHidden and "1" or "0",
        tostring(loadout.petDisplay or 0),
        tostring(loadout.combatPetDisplay or 0),
        tostring(hps),
        tostring(loadout.morphForm or 0),
        tostring(ms),
        tostring(loadout.titleID or 0),
        mountsCsv
    )

    return SanitizeExportString(encoded)
end

local function DeserializeLoadoutString(encoded)
    encoded = encoded:match("^%s*(.-)%s*$")
    local parts = SplitPipe(encoded)
    local idx = 2
    if parts[idx] == FORMAT_VERSION then idx = idx + 1 end
    local name = parts[idx]
    idx = idx + 1

    local itemsIdx = FindItemsFieldIndex(parts, idx)
    local itemsStr = parts[itemsIdx]
    idx = itemsIdx + 1

    local hiddenStr, emh, eoh, mount, mhidden, pet, hpet, hpscale100, morph, mscale100, title, mountsStr
    local legacy = ParseSpecialFields(parts, idx)
    if legacy then
        hiddenStr, emh, eoh, mount, mhidden, pet, hpet, hpscale100, morph, mscale100, title, mountsStr = legacy
    else
        if parts[idx] == EMPTY_HIDDEN_MARKER then
            hiddenStr = ""
            idx = idx + 1
        elseif LooksLikeHiddenCsv(parts[idx]) then
            hiddenStr = parts[idx]
            idx = idx + 1
        else
            hiddenStr = ""
        end

        emh = parts[idx]; idx = idx + 1
        eoh = parts[idx]; idx = idx + 1
        mount = parts[idx]; idx = idx + 1
        mhidden = parts[idx]; idx = idx + 1
        pet = parts[idx]; idx = idx + 1
        hpet = parts[idx]; idx = idx + 1
        hpscale100 = parts[idx]; idx = idx + 1
        morph = parts[idx]; idx = idx + 1
        mscale100 = parts[idx]; idx = idx + 1
        title = parts[idx]; idx = idx + 1
        mountsStr = parts[idx]
    end

    return {
        enchantMH = tonumber(emh) or 0,
        enchantOH = tonumber(eoh) or 0,
        mountDisplay = tonumber(mount) or 0,
        petDisplay = tonumber(pet) or 0,
        combatPetDisplay = tonumber(hpet) or 0,
        morphForm = tonumber(morph) or 0,
    }
end

local l = {
    name = "Test",
    items = {0,0,0,0,0,0,0,0,0,0,0,0,0,0},
    hiddenSlots = {},
    enchantMH = 3846,
    enchantOH = 2404,
    mountDisplay = 1234,
}
local s = SerializeLoadout(l)
print("Export:", s)
local out = DeserializeLoadoutString(s)
print("emh:", out.enchantMH, "eoh:", out.enchantOH, "mount:", out.mountDisplay, "hpet:", out.combatPetDisplay, "morph:", out.morphForm)

export function extractNumericSequence(recordId: string | undefined | null) {
  if (!recordId) return null;
  const matches = recordId.match(/(\d+)/g);
  if (!matches || matches.length === 0) return null;
  // prefer last numeric group, often the serial
  const last = matches[matches.length - 1];
  return {
    value: parseInt(last, 10),
    str: last,
    prefix: recordId.substring(0, recordId.lastIndexOf(last)),
    suffix: recordId.substring(recordId.lastIndexOf(last) + last.length),
  };
}

export function getNextRecordIdFromList(
  recordIds: (string | undefined | null)[]
) {
  // Attempt to parse and get the highest numeric sequence
  let highest = -Infinity;
  let example: { prefix: string; width: number; suffix: string } | null = null;

  for (const id of recordIds) {
    const parsed = extractNumericSequence(id || undefined);
    if (parsed && !Number.isNaN(parsed.value)) {
      if (parsed.value > highest) {
        highest = parsed.value;
        example = {
          prefix: parsed.prefix,
          width: parsed.str.length,
          suffix: parsed.suffix,
        };
      }
    }
  }

  if (!Number.isFinite(highest) || !example) return null;

  const next = highest + 1;
  const padded = String(next).padStart(example.width, '0');
  return `${example.prefix}${padded}${example.suffix}`;
}

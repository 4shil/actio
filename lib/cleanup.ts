// Input cleanup utilities to improve AI output quality

export function cleanupInput(text: string): string {
  let cleaned = text;

  // Remove email headers and signatures
  cleaned = removeEmailHeaders(cleaned);
  cleaned = removeSignatures(cleaned);

  // Normalize whitespace
  cleaned = normalizeWhitespace(cleaned);

  // Remove repeated lines (headers/footers)
  cleaned = removeRepeatedLines(cleaned);

  return cleaned.trim();
}

function removeEmailHeaders(text: string): string {
  const headerPatterns = [
    /^(From|To|Cc|Bcc|Subject|Date|Sent):.*$/gim,
    /^-{2,}Original Message-{2,}$/gim,
    /^>{1,}.*$/gm,
    /^On .+ wrote:$/gim,
  ];

  let result = text;
  for (const pattern of headerPatterns) {
    result = result.replace(pattern, '');
  }
  return result;
}

function removeSignatures(text: string): string {
  const signaturePatterns = [
    /^(Best regards|Kind regards|Regards|Thanks|Thank you|Sincerely|Cheers),?\s*[\s\S]*$/im,
    /^--\s*$/gm,
    /^Sent from my (iPhone|iPad|Android|Samsung|Mobile).*$/gim,
  ];

  let result = text;
  for (const pattern of signaturePatterns) {
    result = result.replace(pattern, '');
  }
  return result;
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
}

function removeRepeatedLines(text: string): string {
  const lines = text.split('\n');
  const seen = new Map<string, number>();
  
  return lines
    .filter(line => {
      const normalized = line.trim().toLowerCase();
      if (!normalized) return true; // Keep empty lines
      
      const count = seen.get(normalized) || 0;
      seen.set(normalized, count + 1);
      
      return count < 2; // Allow first occurrence, remove duplicates
    })
    .join('\n');
}

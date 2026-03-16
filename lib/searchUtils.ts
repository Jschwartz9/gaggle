import { Event } from './types';

export interface SearchResult {
  event: Event;
  relevanceScore: number;
  matchedFields: string[];
}

export interface HighlightedText {
  text: string;
  isHighlight: boolean;
}

/**
 * Debounce function to limit how often a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Normalize text for searching - remove extra spaces, convert to lowercase
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Calculate fuzzy match score using Levenshtein distance
 */
function calculateFuzzyScore(query: string, text: string): number {
  const queryNorm = normalizeText(query);
  const textNorm = normalizeText(text);

  if (textNorm.includes(queryNorm)) {
    // Exact substring match gets highest score
    return 1.0;
  }

  // Check for partial word matches
  const queryWords = queryNorm.split(' ');
  const textWords = textNorm.split(' ');

  let matchedWords = 0;
  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
        matchedWords++;
        break;
      }
    }
  }

  return queryWords.length > 0 ? matchedWords / queryWords.length : 0;
}

/**
 * Search events by multiple criteria with relevance scoring
 */
export function searchEvents(events: Event[], query: string): SearchResult[] {
  if (!query.trim()) {
    return events.map(event => ({
      event,
      relevanceScore: 0,
      matchedFields: []
    }));
  }

  const queryNorm = normalizeText(query);
  const results: SearchResult[] = [];

  for (const event of events) {
    const matchedFields: string[] = [];
    let totalScore = 0;

    // Search in title (highest weight)
    const titleScore = calculateFuzzyScore(queryNorm, event.title);
    if (titleScore > 0) {
      matchedFields.push('title');
      totalScore += titleScore * 3; // 3x weight for title matches
    }

    // Search in description (medium weight)
    const descriptionScore = calculateFuzzyScore(queryNorm, event.description);
    if (descriptionScore > 0) {
      matchedFields.push('description');
      totalScore += descriptionScore * 2; // 2x weight for description matches
    }

    // Search in category (medium weight)
    const categoryScore = calculateFuzzyScore(queryNorm, event.category);
    if (categoryScore > 0) {
      matchedFields.push('category');
      totalScore += categoryScore * 2;
    }

    // Search in vibes tags (medium weight)
    let vibesScore = 0;
    for (const vibe of event.vibesTags) {
      const score = calculateFuzzyScore(queryNorm, vibe);
      if (score > 0) {
        if (!matchedFields.includes('vibes')) {
          matchedFields.push('vibes');
        }
        vibesScore = Math.max(vibesScore, score);
      }
    }
    if (vibesScore > 0) {
      totalScore += vibesScore * 2;
    }

    // Search in location (lower weight)
    const locationScore = Math.max(
      calculateFuzzyScore(queryNorm, event.location.city),
      calculateFuzzyScore(queryNorm, event.location.neighborhood),
      event.location.address ? calculateFuzzyScore(queryNorm, event.location.address) : 0
    );
    if (locationScore > 0) {
      matchedFields.push('location');
      totalScore += locationScore * 1; // 1x weight for location matches
    }

    // Only include events with matches
    if (totalScore > 0) {
      results.push({
        event,
        relevanceScore: totalScore,
        matchedFields
      });
    }
  }

  // Sort by relevance score (descending)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Highlight matching text in search results
 */
export function highlightText(text: string, query: string): HighlightedText[] {
  if (!query.trim()) {
    return [{ text, isHighlight: false }];
  }

  const queryNorm = normalizeText(query);
  const textNorm = normalizeText(text);

  // Find all matches
  const matches: { start: number; end: number }[] = [];

  // First, try exact substring matches
  let index = textNorm.indexOf(queryNorm);
  while (index !== -1) {
    matches.push({ start: index, end: index + queryNorm.length });
    index = textNorm.indexOf(queryNorm, index + 1);
  }

  // If no exact matches, try word-by-word matching
  if (matches.length === 0) {
    const queryWords = queryNorm.split(' ');
    for (const word of queryWords) {
      if (word.length < 2) continue; // Skip very short words

      let wordIndex = textNorm.indexOf(word);
      while (wordIndex !== -1) {
        matches.push({ start: wordIndex, end: wordIndex + word.length });
        wordIndex = textNorm.indexOf(word, wordIndex + 1);
      }
    }
  }

  if (matches.length === 0) {
    return [{ text, isHighlight: false }];
  }

  // Merge overlapping matches and sort by start position
  const mergedMatches = mergeOverlappingRanges(matches);

  // Create highlighted segments
  const segments: HighlightedText[] = [];
  let lastEnd = 0;

  for (const match of mergedMatches) {
    // Add non-highlighted text before this match
    if (match.start > lastEnd) {
      segments.push({
        text: text.substring(lastEnd, match.start),
        isHighlight: false
      });
    }

    // Add highlighted text
    segments.push({
      text: text.substring(match.start, match.end),
      isHighlight: true
    });

    lastEnd = match.end;
  }

  // Add remaining non-highlighted text
  if (lastEnd < text.length) {
    segments.push({
      text: text.substring(lastEnd),
      isHighlight: false
    });
  }

  return segments;
}

/**
 * Merge overlapping ranges
 */
function mergeOverlappingRanges(ranges: { start: number; end: number }[]): { start: number; end: number }[] {
  if (ranges.length === 0) return [];

  const sorted = ranges.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end + 1) { // +1 to merge adjacent ranges
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Get search suggestions based on existing events
 */
export function getSearchSuggestions(events: Event[], query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];

  const queryNorm = normalizeText(query);
  const suggestions = new Set<string>();

  // Collect potential suggestions
  for (const event of events) {
    // From titles
    if (normalizeText(event.title).includes(queryNorm)) {
      suggestions.add(event.title);
    }

    // From categories
    if (normalizeText(event.category).includes(queryNorm)) {
      suggestions.add(event.category);
    }

    // From vibes tags
    for (const vibe of event.vibesTags) {
      if (normalizeText(vibe).includes(queryNorm)) {
        suggestions.add(vibe);
      }
    }

    // From locations
    if (normalizeText(event.location.neighborhood).includes(queryNorm)) {
      suggestions.add(event.location.neighborhood);
    }
  }

  return Array.from(suggestions).slice(0, limit);
}
function calculateReadingTime(content, options = {}) {
    // Default options
    const defaultOptions = {
        averageWordsPerMinute: 50, // Average reading speed in words per minute
        specialFormattingFactor: 1.2, // Factor to adjust for special formatting (e.g., headings, images)
        userReadingSpeed: 15 // Optionally, allow the user to specify their reading speed
    };

    // Merge options with defaults
    const { averageWordsPerMinute, specialFormattingFactor, userReadingSpeed } = { ...defaultOptions, ...options };

    // Count words in the content
    const wordCount = content.trim().split(/\s+/).length;

    // Calculate adjusted reading time based on factors like formatting
    const adjustedWordCount = wordCount * specialFormattingFactor;

    // Use user-specified reading speed if available, else use default
    const readingSpeed = userReadingSpeed || averageWordsPerMinute;

    // Calculate reading time in minutes
    const readingTime = Math.ceil(adjustedWordCount / readingSpeed);

    return readingTime;
}


module.exports = calculateReadingTime;

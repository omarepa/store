// # We would like to define a system where users can make custom prompts for an LLM.
// # Each prompt has phrases that may be used to activate them
// # Users will enter there phrases into a web-interface;
// # However, we have to validate these phrases before allowing them to be used as prompts in the LLM.
// # If they aren't valid, the users should be told which rules were violated along with the words that violate it.
// #
// # Example rules:
// # Phrases shouldn't contain more than 2 repeating words
// # Phrases shouldn't contain sensitive language
// #
// # Objective: Validate user-entered phrases for LLM prompts
// #
// # Output: if a phrase is invalid, notify the use of the violated rules and the problematic words

function validatePrompt(prompt: string): ValidationResult {
  const rules: Rule[] = [
    {
      name: "No more than 2 repeating words",
      validate: (prompt: string) => {
        const words = prompt.split(" ");
        const wordCounts = words.reduce((counts, word) => {
          counts[word] = (counts[word] || 0) + 1;
          return counts;
        }, {} as Record<string, number>);
        return Object.values(wordCounts).every((count) => count <= 2);
      },
    },
    {
      name: "No sensitive language",
      validate: (prompt: string) => {
        const sensitiveWords = ["bad", "worst", "terrible"];
        return sensitiveWords.every(
          (word) => !prompt.toLowerCase().includes(word)
        );
      },
    },
  ];

  const violations = rules.filter((rule) => !rule.validate(prompt));

  return {
    isValid: violations.length === 0,
    violations: violations.map((rule) => rule.name),
  };
}

interface Rule {
  name: string;
  validate: (prompt: string) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  violations: string[];
}

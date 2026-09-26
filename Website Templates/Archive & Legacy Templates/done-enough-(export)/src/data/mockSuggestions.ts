import { FocusTask } from "../types";

/**
 * Intelligent client-side mock AI analyzer for “Done Enough”.
 * Looks for context clues in the brain dump to produce tailored, comforting steps.
 */
export function analyzeBrainDump(text: string): FocusTask {
  const normalized = text.toLowerCase();
  
  // Default values
  let primaryStep = "Release the outline structure";
  let reassuringReason = "Defining the basic skeleton today secures your mental momentum.";
  let subStepsText = [
    "Jot down 3 bullet points on a napkin",
    "Write the introduction paragraph with full spelling mistakes allowed",
    "Close the tab and walk away for 5 minutes"
  ];
  let energyLevel: "Calm" | "Steady" | "High" = "Steady";
  let doneEnoughMetric = 75; // Perfection cutoff line
  let doneEnoughReason = "A raw three-item bullet sketch that is rough around the edges.";
  let category: FocusTask["category"] = "Work";

  // Match: Writing / Content Creation / Blog / Article
  if (normalized.includes("write") || normalized.includes("blog") || normalized.includes("essay") || normalized.includes("article") || normalized.includes("book") || normalized.includes("pitch")) {
    primaryStep = "Draft the ultra-rough first 200 words";
    reassuringReason = "A draft can always be edited, but a blank page contains only your anxiety.";
    subStepsText = [
      "Open a blank document and write a single terrible headline",
      "Type 3 bullet points expressing your main message",
      "Draft 3 paragraphs without looking back or editing previous sentences",
      "Declare the draft 80% complete and share it with one trusted person"
    ];
    energyLevel = "Steady";
    doneEnoughMetric = 70;
    doneEnoughReason = "A 200-word block explaining the basic structure of the piece, ignoring layout or formatting details.";
    category = "Creation";
  }
  // Match: Coding / Web / Landing / App / Dev
  else if (normalized.includes("code") || normalized.includes("build") || normalized.includes("app") || normalized.includes("website") || normalized.includes("landing") || normalized.includes("bug") || normalized.includes("dev")) {
    primaryStep = "Get the bare minimum mock UI onto the screen";
    reassuringReason = "Static mock states are standard proof-of-work. Re-writing animations can wait for next week.";
    subStepsText = [
      "Set up the local state with placeholder static inputs",
      "Render a single button that executes the core state change",
      "Check responsiveness in the center of your screen",
      "Refuse to add extra animations or visual micro-details today"
    ];
    energyLevel = "High";
    doneEnoughMetric = 80;
    doneEnoughReason = "Interactive static elements where clicking a button triggers a state change.";
    category = "Work";
  }
  // Match: Taxes / Finance / Budget / Admin / Expense
  else if (normalized.includes("tax") || normalized.includes("finance") || normalized.includes("budget") || normalized.includes("invoice") || normalized.includes("admin") || normalized.includes("money")) {
    primaryStep = "List the top 5 receipts you actually remember";
    reassuringReason = "Accountants want values first. Fancy color tags in spreadsheets don't affect your totals.";
    subStepsText = [
      "Gather the paper receipts from your desk or purse",
      "Open one bank statement file for the correct month",
      "Type the top 5 numbers into a single spreadsheet row",
      "Close the spreadsheet. Excel does not need to look pretty today."
    ];
    energyLevel = "Calm";
    doneEnoughMetric = 65;
    doneEnoughReason = "Exactly five rows filled with the core numbers from your bank report.";
    category = "Life";
  }
  // Match: Clean / Room / Kitchen / Laundry / House / Apartment
  else if (normalized.includes("clean") || normalized.includes("house") || normalized.includes("room") || normalized.includes("kitchen") || normalized.includes("laundry") || normalized.includes("wash") || normalized.includes("desk")) {
    primaryStep = "Clear only the middle square of the surface";
    reassuringReason = "Visual calm comes from small clear islands. Clean houses are spaces that are lived in.";
    subStepsText = [
      "Move items from the immediate center of your desk/counter into a small pile",
      "Wipe down that center square with a cloth",
      "Sort exactly 5 items from the pile into drawers or trash bin",
      "Leave the rest. The surface is officially 'clean enough'."
    ];
    energyLevel = "Calm";
    doneEnoughMetric = 60;
    doneEnoughReason = "One wiped, clean center surface containing exactly zero loose coffee cups.";
    category = "Unclutter";
  }
  // Match: Studying / Quiz / Read / Exam / Book / Learn
  else if (normalized.includes("study") || normalized.includes("quiz") || normalized.includes("exam") || normalized.includes("read") || normalized.includes("learn") || normalized.includes("homework") || normalized.includes("class")) {
    primaryStep = "Review exactly 1 chapter summary page";
    reassuringReason = "Learning is consolidated in the recap phase rather than re-reading information already learned.";
    subStepsText = [
      "Flip directly to the end of the chapter and locate the summary bullets",
      "Highlight 3 key bold terms with a digital or virtual fluid pen",
      "Answer just 2 practice quiz questions in your head",
      "Close the book. Your brain has successfully cached the essence."
    ];
    energyLevel = "Steady";
    doneEnoughMetric = 75;
    doneEnoughReason = "A basic understanding of three key vocabulary bullets from the summary table.";
    category = "Studying";
  }
  // Fallback: Generic, premium perfectionist-busting defaults based on length
  else if (text.trim().length > 0) {
    primaryStep = `Begin the initial 15-minute skeleton version`;
    reassuringReason = "Getting the first physical movement establishes dynamic momentum to finish.";
    subStepsText = [
      "Split the task description into a simple 3-step pathway",
      "Work uninterrupted for just 8 minutes with absolute permission to make mistakes",
      "Define exactly what constitutes the MVP (Minimum Viable Product)",
      "Commit your current draft and stop researching for more answers"
    ];
    energyLevel = text.trim().length > 60 ? "High" : "Steady";
    doneEnoughMetric = 70;
    doneEnoughReason = "A basic three-item bullet sketch that is rough around the edges.";
    category = "Work";
  }

  // Enforce Cognitive Overload Protection details
  let filteredSubSteps = subStepsText.slice(0, 5);
  // Pad if less than 3
  while (filteredSubSteps.length < 3) {
    filteredSubSteps.push("Take a brief 30-second breath break to stabilize focus");
  }

  // Add comforting archived warning message if text represents a multi-stage project or massive mind dump
  const isMasiveInput = text.length > 200 || text.split("\n").length >= 3 || text.includes(",") || text.includes(";");
  let finalReassuringReason = reassuringReason;
  if (isMasiveInput && !reassuringReason.includes("archived the rest of the noise")) {
    finalReassuringReason = `We archived the rest of the noise. Focus only on this line right now. ${reassuringReason}`;
  }

  return {
    id: `task_${Date.now()}`,
    sourceText: text,
    primaryStep,
    reassuringReason: finalReassuringReason,
    subSteps: filteredSubSteps.map((stepText, idx) => ({
      id: `sub_${idx}_${Date.now()}`,
      text: stepText,
      completed: false,
    })),
    energyLevel,
    doneEnoughMetric,
    doneEnoughReason,
    category,
  };
}

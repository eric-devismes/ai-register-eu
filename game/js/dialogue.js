// ============================================================
// AEONS OF DUAT — Dialogue System (FF-style text boxes)
// ============================================================

G.dialogueActive = false;

G.dialogue = (function() {
  let lines = [];
  let currentLine = 0;
  let charIndex = 0;
  let charTimer = 0;
  let speed = 2; // frames per character
  let waitingForInput = false;
  let callback = null;

  function start(textLines, onComplete) {
    lines = textLines;
    currentLine = 0;
    charIndex = 0;
    charTimer = 0;
    waitingForInput = false;
    G.dialogueActive = true;
    callback = onComplete || null;
  }

  function update() {
    if (!G.dialogueActive) return;

    if (waitingForInput) {
      if (G.justPressed.confirm || G.justPressed.cancel) {
        G.audio.sfx('cursor');
        currentLine++;
        // Skip empty lines
        while (currentLine < lines.length && lines[currentLine] === '') {
          currentLine++;
        }

        if (currentLine >= lines.length) {
          G.dialogueActive = false;
          if (callback) callback();
          return;
        }
        charIndex = 0;
        charTimer = 0;
        waitingForInput = false;
      }
    } else {
      charTimer++;
      if (charTimer >= speed) {
        charTimer = 0;
        charIndex++;

        // Find how many lines to show (up to 4 at a time from currentLine)
        const displayLines = getDisplayLines();
        const totalChars = displayLines.join('').length;

        if (charIndex >= totalChars) {
          waitingForInput = true;
        }
      }

      // Fast forward
      if (G.justPressed.confirm) {
        const displayLines = getDisplayLines();
        const totalChars = displayLines.join('').length;
        charIndex = totalChars;
        waitingForInput = true;
      }
    }
  }

  function getDisplayLines() {
    const result = [];
    for (let i = currentLine; i < lines.length && result.length < 4; i++) {
      if (lines[i] === '' && result.length > 0) break;
      result.push(lines[i]);
    }
    return result;
  }

  function draw() {
    if (!G.dialogueActive) return;

    const boxH = 52;
    const boxY = G.IH - boxH - 4;

    // Dialog window
    G.window(4, boxY, G.IW - 8, boxH);

    // Text
    const displayLines = getDisplayLines();
    let charsShown = 0;

    displayLines.forEach((line, i) => {
      const y = boxY + 6 + i * 10;
      let lineText = '';

      for (let c = 0; c < line.length; c++) {
        if (charsShown < charIndex) {
          lineText += line[c];
          charsShown++;
        }
      }

      // First line might be a speaker name (different color)
      const isName = i === 0 && line.endsWith(':');
      G.text(lineText, 10, y, isName ? '#ffd700' : '#fff');
    });

    // Blinking triangle when waiting
    if (waitingForInput && Math.sin(G.time * 6) > 0) {
      G.text('>', G.IW - 18, boxY + boxH - 12, '#fff');
    }
  }

  return { start, update, draw };
})();

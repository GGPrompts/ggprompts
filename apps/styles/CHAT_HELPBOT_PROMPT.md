# Build Advanced Chat Helpbot Component - Full Context Prompt

**Copy everything below this line and paste into Claude.ai**

---

# Project Context

I'm building a Next.js 15 portfolio with 114+ production templates. I need you to create a **production-ready, advanced chat helpbot component/template** that matches my existing design system and can be integrated with local LLMs later.

## Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v3** with custom terminal theme
- **Framer Motion** for animations
- **shadcn/ui components** (40+ installed)
- **Lucide React** icons

## Design System (CRITICAL - Must Follow)

### Color Scheme (Terminal Theme)
```css
/* Current theme variables */
--background: hsl(220 13% 5%)        /* Very dark slate/black */
--foreground: hsl(160 84% 95%)       /* Light cyan-white */
--primary: hsl(160 84% 39%)          /* Terminal green/cyan */
--secondary: hsl(173 80% 40%)        /* Teal accent */
--border: hsl(160 60% 25%)           /* Cyan border */
```

### Custom Glassmorphism Utilities (Use These!)
```css
.glass {
  background: rgba(16, 185, 129, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1), inset 0 0 20px rgba(16, 185, 129, 0.02);
}

.terminal-glow {
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
}

.border-glow {
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.1);
}
```

### Available shadcn/ui Components
Card, Badge, Button, Input, Textarea, Separator, Skeleton, Tabs, Accordion, Dialog, Drawer, Tooltip, HoverCard, Popover, ScrollArea, Switch, Avatar, Progress, and more.

## What I Need You to Build

### File Structure
Create a new template at: `app/templates/chat-helpbot/page.tsx`

### Component Requirements

#### 1. **Core Chat Interface**
- Clean, modern chat UI with message bubbles
- User messages (right-aligned, primary color)
- Bot messages (left-aligned, glass effect)
- Timestamp on messages
- Avatar icons for user/bot
- Auto-scroll to latest message
- Message history display

#### 2. **Input Area**
- Textarea that grows with content (max 5 lines)
- Send button (disabled when empty)
- Enter to send, Shift+Enter for new line
- Character/token counter (optional)
- Upload file button (UI only for now)
- Stop generation button (when streaming)

#### 3. **Advanced Features**
- **Typing indicator**: Animated "..." when bot is "thinking"
- **Suggested prompts**: Quick-start buttons for common queries
- **Message actions**: Copy, regenerate, thumbs up/down on each message
- **Conversation sessions**: Sidebar with chat history/sessions
- **Model selector**: Dropdown to "choose" different models (UI only)
- **System prompt editor**: Collapsible section to customize bot behavior
- **Context window indicator**: Show tokens used / max tokens
- **Streaming simulation**: Typewriter effect for bot responses
- **Code highlighting**: Use syntax highlighting for code blocks in messages
- **Markdown support**: Render markdown in messages properly
- **Export chat**: Download conversation as markdown/JSON

#### 4. **Widget Mode**
- Collapsible floating widget (bottom-right)
- Expand/collapse with smooth animation
- Minimized: Small chat bubble icon with notification badge
- Expanded: Full chat interface in a drawer/dialog
- Toggle between full-page and widget modes

#### 5. **Settings Panel**
- Temperature slider (0-1)
- Max tokens input
- Model selection (mock options: GPT-4, Claude, Llama, Mistral, etc.)
- System prompt textarea
- Clear conversation button
- Export settings as JSON

#### 6. **Mock Backend Integration**
- Simulate API calls with setTimeout delays (1-3 seconds)
- Mock streaming with character-by-character typing effect
- Sample bot responses that demonstrate capabilities
- Error handling UI (rate limits, API errors, network issues)
- Retry mechanism for failed messages

#### 7. **Polish & UX**
- Loading states with skeletons
- Empty state when no messages
- Smooth animations with Framer Motion
- Glassmorphic cards throughout
- Terminal glow effects on hover
- Responsive design (mobile-friendly)
- Keyboard shortcuts (Cmd+K to focus input, Esc to close widget)
- Accessibility (ARIA labels, keyboard navigation)

## Sample Features to Showcase

Include 4-5 **suggested prompt cards** at the start:
- "Help me debug this TypeScript error"
- "Explain how async/await works"
- "Generate a React component"
- "Review my code for best practices"
- "Write unit tests for this function"

Include **mock conversations** to show capability:
- Code generation example
- Debugging assistance
- Explanation with markdown/code
- Multi-turn conversation

## API Integration Points (For Future)

Add clear TODO comments showing where to integrate real APIs:

```typescript
// TODO: Replace with actual API call
// Example:
// const response = await fetch('/api/chat', {
//   method: 'POST',
//   body: JSON.stringify({ messages, model, temperature }),
// })
// const data = await response.json()
```

Make it easy to swap the mock backend with:
- OpenAI API
- Anthropic Claude API
- Local LLM (Ollama, LM Studio)
- Custom streaming endpoint

## Code Quality Standards

- **TypeScript**: Strict types for all props, state, functions
- **Component organization**: Separate components for Message, InputArea, SettingsPanel, etc.
- **Clean code**: Readable, well-commented, production-ready
- **Performance**: Optimize re-renders, memoize where needed
- **Error boundaries**: Handle edge cases gracefully

## Visual Style Reference

Think: **Modern SaaS chat interface meets terminal aesthetic**
- Inspired by: ChatGPT, Claude.ai, Poe.com
- But with: Glassmorphism, terminal green/cyan colors, glowing effects
- Feel: Professional, polished, sophisticated

## Implementation Strategy

You can use **subagents** if you want to:
1. One agent for the main chat interface
2. One agent for the widget/floating mode
3. One agent for the settings panel
4. One agent for message rendering/markdown

Or build it all in one comprehensive file (I'm fine with a large file if it's well-organized).

## Deliverable

A single, production-ready `page.tsx` file (or component breakdown if you prefer) that:
- Follows my exact design system
- Uses existing shadcn/ui components where possible
- Has all advanced features working (with mock data)
- Is fully responsive and accessible
- Includes clear integration points for real APIs
- Has smooth animations and polished UX
- Can be used as both a full-page template AND a reusable component

## Example Message Flow

1. User opens page/widget → See suggested prompts
2. User clicks "Help me debug..." or types custom message
3. Bot shows typing indicator (1-2s)
4. Bot streams response with typewriter effect
5. User can copy, regenerate, or continue conversation
6. Settings panel allows customization
7. Chat history is saved in session list

## Additional Notes

- Make it impressive! This will be a portfolio showcase piece
- Focus on UX polish and attention to detail
- Use Framer Motion liberally for smooth transitions
- Add micro-interactions (hover states, focus rings, etc.)
- Include helpful inline documentation for future me
- Make the mock responses realistic and helpful

## Success Criteria

When you're done, I should be able to:
- ✅ Have a beautiful, functional chat interface
- ✅ See all advanced features working with mock data
- ✅ Easily integrate with my local LLMs later (clear TODOs)
- ✅ Use it as a reusable widget in other templates
- ✅ Show it off in my portfolio as a standout piece

Build something amazing! 🚀

---

**End of prompt - paste everything above into Claude.ai**

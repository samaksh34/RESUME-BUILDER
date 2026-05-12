# 🚀 ResumeCraft: Centralized Template Architecture

This document outlines the strategic refactor of ResumeCraft from a basic builder to a production-grade Document Platform.

## 🏗️ The Core Principle: Template ≠ Engine
We are decoupling **Visual Style** from **Rendering Logic**.

### 1. CORE ENGINE (Global & Immutable)
Located in `src/core/`. This handles the "Laws of Physics" for our resumes.
- **A4 Paper System**: Exact 210mm × 297mm dimensions.
- **Export Pipeline**: Unified Playwright logic.
- **Typography Loader**: Deterministic font-face management.
- **Print System**: Global resets for zero-margin PDF generation.

### 2. TEMPLATE LAYER (Visual & Configurable)
Located in `src/templates/`. Each template is a "Skin" for the engine.
- **ATS Overleaf**: Flagship (EB Garamond, LaTeX-style, High Density).
- **Modern**: (Inter/Poppins, Grid Layouts, Color Accents).
- **Classic**: (Serif fonts, Formal alignment, Traditional Spacing).

---

## 📅 Implementation Roadmap

### Phase 1: Engine Extraction 🛠️
- Extract A4 sizing and global print CSS from components into `src/core/print/`.
- Create `ResumeRenderer.jsx` to serve as the unified bridge between Data and Design.
- Establish the `TemplateRegistry.js` for dynamic switching.

### Phase 2: Flagship Template (ATS Overleaf) 🎓
- Build the `ATSOverleaf` component with strict LaTeX-inspired spacing.
- Implement `EBGaramond` as the primary professional typeface.
- Create the first `templateConfig` object to define spacing and divider weights.

### Phase 4: Scaling the Library 📚
- Port existing "Modern" and "Classic" layouts into the new modular system.
- Ensure all templates use the shared `ResumeRenderer` for 1:1 preview-to-export parity.
- implement global font-loading guards to prevent PDF layout shifts.

### Phase 4: Role-Based Intelligence 🧠
- Implement configuration presets for different roles (Engineer, PM, Designer).
- Allow these presets to reorder sections dynamically within the selected template.
- Final sync of the Playwright backend to use the new Unified Engine.

---

## 🛑 The "Never Change" List
These features are controlled by the **Engine** and MUST NOT be hardcoded in templates:
1. **Viewport/A4 Scale**: Always handled by the Core.
2. **PDF Generation Settings**: Always handled by the Core.
3. **Data Fetching**: Always handled by the Context.

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StylePresets from './StylePresets.jsx'
import LayerControls from './LayerControls.jsx'
import TypographyControls from './TypographyControls.jsx'
import FormatControls from './FormatControls.jsx'
import ShapeMaskControls from './ShapeMaskControls.jsx'

const TABS = ['Style', 'Layers', 'Text', 'Format', 'Shape']

export default function CustomizationPanel({
  activePreset,
  layerVisibility,
  layerColors,
  typography,
  format,
  shapeMask,
  onPresetSelect,
  onLayerToggle,
  onLayerColorChange,
  onTypographyChange,
  onFormatChange,
  onShapeChange,
}) {
  const [activeTab, setActiveTab] = useState('Style')

  return (
    <div className="flex flex-col h-full">
      {/* Tab nav */}
      <div className="flex border-b border-border shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs transition-colors ${
              activeTab === tab
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-accent/40 hover:text-accent/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'Style' && (
              <StylePresets activePreset={activePreset} onSelect={onPresetSelect} />
            )}
            {activeTab === 'Layers' && (
              <LayerControls
                visibility={layerVisibility}
                colors={layerColors}
                onToggle={onLayerToggle}
                onColorChange={onLayerColorChange}
              />
            )}
            {activeTab === 'Text' && (
              <TypographyControls typography={typography} onChange={onTypographyChange} />
            )}
            {activeTab === 'Format' && (
              <FormatControls format={format} onChange={onFormatChange} />
            )}
            {activeTab === 'Shape' && (
              <ShapeMaskControls shape={shapeMask} onChange={onShapeChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { X, Plus, Sparkles, DollarSign, Scale, Beaker } from 'lucide-react';
import { calculateSavings } from '../data/kits';

export const POPULAR_YEASTS = [
  { strain: 'SafAle US-05', brand: 'Fermentis', desc: 'Clean, neutral American ale yeast' },
  { strain: 'SafAle S-04', brand: 'Fermentis', desc: 'British ale yeast, high flocculation, bready' },
  { strain: 'Lallemand Verdant IPA', brand: 'Lallemand', desc: 'Lush apricot esters, velvety permanent haze' },
  { strain: 'Saflager W-34/70', brand: 'Fermentis', desc: 'World famous Weihenstephan German lager strain' },
  { strain: 'Lallemand NovaLager', brand: 'Lallemand', desc: 'Modern hybrid lager, ultra clean at room temp' },
  { strain: 'Lallemand Philly Sour', brand: 'Lallemand', desc: 'Synthesizes lactic acid & ethanol together' },
  { strain: 'SafAle WB-06', brand: 'Fermentis', desc: 'Belgian wheat / hefeweizen banana & clove' },
  { strain: 'SafCider AB-1', brand: 'Fermentis', desc: 'Crisp aromatic cider yeast' },
];

export default function CustomKitModal({ isOpen, onClose, onSaveKit }) {
  const { mode, t } = useTerminology();

  const [name, setName] = useState('');
  const [style, setStyle] = useState('New England IPA');
  const [abv, setAbv] = useState(5.5);
  const [calories, setCalories] = useState(205);
  const [baseTau, setBaseTau] = useState(68);
  const [somaTau, setSomaTau] = useState(1.15);
  const [crowdTau, setCrowdTau] = useState(1.25);
  const [chillHours, setChillHours] = useState(84);
  const [retailPrice, setRetailPrice] = useState(40.00);
  const [diyCost, setDiyCost] = useState(11.00);

  // Malt Base
  const [dmeGrams, setDmeGrams] = useState(950);
  const [maltType, setMaltType] = useState('Golden Light DME');
  const [adjuncts, setAdjuncts] = useState('100g Flaked Oats for velvety silk');

  // Hop Tea & Hopper
  const [hopTeaGrams, setHopTeaGrams] = useState(15);
  const [hopTeaVariety, setHopTeaVariety] = useState('Citra & Mosaic');
  const [hopperGrams, setHopperGrams] = useState(25);
  const [hopperVariety, setHopperVariety] = useState('Citra & Galaxy');
  const [selectedYeast, setSelectedYeast] = useState(POPULAR_YEASTS[2].strain);
  const [yeastGrams, setYeastGrams] = useState(8);

  // Scores
  const [silk, setSilk] = useState(8.5);
  const [dc, setDc] = useState(4.5);
  const [as, setAs] = useState(3.0);
  const [aroma, setAroma] = useState(9.0);
  const [drag, setDrag] = useState(1.0);
  const [carb, setCarb] = useState(7.5);
  const [buzz, setBuzz] = useState(9.0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newKit = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      subtitle: `Custom DIY ${style}`,
      style,
      category: 'Custom DIY',
      isCustom: true,
      abv: parseFloat(abv),
      calories: parseInt(calories, 10),
      baseTau: parseInt(baseTau, 10),
      somaTau: parseFloat(somaTau),
      crowdTau: parseFloat(crowdTau),
      defaultUndockTau: parseFloat(somaTau),
      chillHours: parseInt(chillHours, 10),
      retailPrice: parseFloat(retailPrice),
      diyCost: parseFloat(diyCost),
      maltBase: {
        dmeGrams: parseInt(dmeGrams, 10),
        dmeOunces: Number((dmeGrams / 28.3495).toFixed(1)),
        lmeGrams: Math.round(dmeGrams * 1.22),
        lmeOunces: Number(((dmeGrams * 1.22) / 28.3495).toFixed(1)),
        maltType,
        adjuncts: adjuncts || 'None'
      },
      hopTea: {
        grams: parseInt(hopTeaGrams, 10),
        variety: hopTeaVariety,
        waterVolume: '1.0 L',
        steepMinutes: 10,
        temperature: 'Simmer 195°F / 90°C',
        notes: '10-minute simmer extract.'
      },
      hopper: {
        grams: parseInt(hopperGrams, 10),
        variety: hopperVariety,
        method: '48h 60mL Vodka Tincture OR 2.5 mL Hopzoil',
        hopOilMl: 2.5,
        notes: 'Cold dry aroma addition.'
      },
      yeast: {
        strain: selectedYeast,
        grams: parseInt(yeastGrams, 10),
        brand: POPULAR_YEASTS.find(y => y.strain === selectedYeast)?.brand || 'Commercial Yeast',
        cellCountBillions: yeastGrams * 10,
        attenuation: '78-82%',
        flocculation: 'Medium',
        optimumTemp: '66-72°F'
      },
      scores: {
        silk: parseFloat(silk),
        dc: parseFloat(dc),
        as: parseFloat(as),
        aroma: parseFloat(aroma),
        drag: parseFloat(drag),
        carb: parseFloat(carb),
        buzz: parseFloat(buzz)
      },
      bioDescription: `Custom kinetic design targeting high G4 daughter viability and controlled phenolic separation for 5,450 mL volume.`,
      humanDescription: `Your personal custom craft recipe. Fresh hops, exact malt ratio, and tailored for maximum deliciousness and smooth buzz.`
    };

    onSaveKit(newKit);
    onClose();
  };

  const savings = calculateSavings(retailPrice, diyCost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="hw-panel max-w-3xl w-full p-6 shadow-2xl relative my-8 border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded hw-well text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg hw-well border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">Create Custom Open-Source DIY Recipe</h2>
            <p className="text-xs font-mono-tabular text-slate-400">
              Calibrated precisely for the <strong className="text-cyan-400">5,450 mL</strong> Pinter liquid fill line
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-tabular">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Recipe / Clone Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electric Citra Haze"
                className="w-full px-3 py-1.5 rounded hw-well border border-white/10 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Beer Style</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g. Hazy IPA"
                className="w-full px-3 py-1.5 rounded hw-well border border-white/10 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Estimated ABV (%)</label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="12.0"
                value={abv}
                onChange={(e) => setAbv(e.target.value)}
                className="w-full px-3 py-1.5 rounded hw-well border border-white/10 text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Malt Base Configuration */}
          <div className="hw-well p-3.5 rounded border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Malt Base (5,450 mL Fill Line)</span>
              </span>
              <span className="text-[10px] text-slate-400">
                LME Equivalent: <strong className="text-amber-300">{Math.round(dmeGrams * 1.22)}g</strong> (&times;1.22)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Dry Malt Extract (DME g)</label>
                <input
                  type="number"
                  step="25"
                  min="400"
                  max="1800"
                  value={dmeGrams}
                  onChange={(e) => setDmeGrams(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#0B0E14] border border-white/10 text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Malt Profile / Type</label>
                <input
                  type="text"
                  value={maltType}
                  onChange={(e) => setMaltType(e.target.value)}
                  placeholder="e.g. Golden Light + Wheat DME"
                  className="w-full px-2.5 py-1.5 rounded bg-[#0B0E14] border border-white/10 text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Adjuncts / Oats / Flakes</label>
                <input
                  type="text"
                  value={adjuncts}
                  onChange={(e) => setAdjuncts(e.target.value)}
                  placeholder="e.g. 100g Flaked Oats"
                  className="w-full px-2.5 py-1.5 rounded bg-[#0B0E14] border border-white/10 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hop Tea, Hopper, & Commercial Yeast */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="hw-well p-3 rounded space-y-1.5">
              <label className="block text-[10px] uppercase text-emerald-400 font-bold">10-Min Hop Tea (1L Simmer)</label>
              <input
                type="text"
                value={hopTeaVariety}
                onChange={(e) => setHopTeaVariety(e.target.value)}
                placeholder="Hop Variety"
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white outline-none"
              />
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  value={hopTeaGrams}
                  onChange={(e) => setHopTeaGrams(e.target.value)}
                  className="w-16 px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
                />
                <span className="text-[10px] text-slate-400">g pellets</span>
              </div>
            </div>

            <div className="hw-well p-3 rounded space-y-1.5">
              <label className="block text-[10px] uppercase text-purple-400 font-bold">DIY Hopper Aroma Shot</label>
              <input
                type="text"
                value={hopperVariety}
                onChange={(e) => setHopperVariety(e.target.value)}
                placeholder="Aroma Variety"
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white outline-none"
              />
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  value={hopperGrams}
                  onChange={(e) => setHopperGrams(e.target.value)}
                  className="w-16 px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
                />
                <span className="text-[10px] text-slate-400">g in 60mL vodka</span>
              </div>
            </div>

            <div className="hw-well p-3 rounded space-y-1.5">
              <label className="block text-[10px] uppercase text-cyan-400 font-bold">Commercial Yeast Strain</label>
              <select
                value={selectedYeast}
                onChange={(e) => setSelectedYeast(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white outline-none"
              >
                {POPULAR_YEASTS.map((y) => (
                  <option key={y.strain} value={y.strain}>
                    {y.strain} ({y.brand})
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  value={yeastGrams}
                  onChange={(e) => setYeastGrams(e.target.value)}
                  className="w-16 px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
                />
                <span className="text-[10px] text-slate-400">g dry packet</span>
              </div>
            </div>
          </div>

          {/* Tau Timings & Economics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded hw-well border border-white/5">
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Base &tau; (Hours)</label>
              <input
                type="number"
                value={baseTau}
                onChange={(e) => setBaseTau(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Soma-Max Undock (&tau;)</label>
              <input
                type="number"
                step="0.05"
                value={somaTau}
                onChange={(e) => setSomaTau(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Fridge Chill (Hours)</label>
              <input
                type="number"
                value={chillHours}
                onChange={(e) => setChillHours(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-emerald-400 mb-0.5 font-bold">DIY Cost ($)</label>
              <input
                type="number"
                step="0.5"
                value={diyCost}
                onChange={(e) => setDiyCost(e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#0B0E14] border border-emerald-500/40 text-emerald-300 font-bold"
              />
            </div>
          </div>

          {/* Financial Delta Badge */}
          <div className="flex items-center justify-between p-2.5 rounded hw-well border border-emerald-500/30 text-emerald-300">
            <span>Pinter Retail: ~${retailPrice.toFixed(2)} vs DIY Cost: ${parseFloat(diyCost).toFixed(2)}</span>
            <span className="font-bold">[ -{savings.percent}% COST DELTA // SAVE ${savings.savedAmount} ]</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded hw-well text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold transition shadow-lg flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save DIY Clone to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

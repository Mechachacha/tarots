interface ArcanaSelectorProps {
  useMajor: boolean;
  useMinor: boolean;
  onChange: (useMajor: boolean, useMinor: boolean) => void;
}

const ArcanaSelector: React.FC<ArcanaSelectorProps> = ({ useMajor, useMinor, onChange }) => {
  const handleToggle = (arcana: 'major' | 'minor') => {
    if (arcana === 'major') {
      const nextMajor = !useMajor;
      if (!nextMajor && !useMinor) return;
      onChange(nextMajor, useMinor);
    } else {
      const nextMinor = !useMinor;
      if (!useMajor && !nextMinor) return;
      onChange(useMajor, nextMinor);
    }
  };

  const majorId = 'arcana-major';
  const minorId = 'arcana-minor';

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-tarot-light mb-3">デッキに含めるカード</p>
      <div className="flex gap-6">
        <label htmlFor={majorId} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id={majorId}
            checked={useMajor}
            onChange={() => handleToggle('major')}
            className="w-5 h-5 text-tarot-purple border-white/30 rounded focus:ring-2 focus:ring-tarot-purple accent-tarot-purple"
          />
          <span className="text-tarot-light font-medium">大アルカナ（22枚）</span>
        </label>
        <label htmlFor={minorId} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id={minorId}
            checked={useMinor}
            onChange={() => handleToggle('minor')}
            className="w-5 h-5 text-tarot-purple border-white/30 rounded focus:ring-2 focus:ring-tarot-purple accent-tarot-purple"
          />
          <span className="text-tarot-light font-medium">小アルカナ（56枚）</span>
        </label>
      </div>
      <p className="mt-2 text-sm text-tarot-text">
        {useMajor && useMinor ? '大アルカナ・小アルカナの全78枚で占います' :
         useMajor ? '大アルカナ22枚のみで占います' :
         '小アルカナ56枚のみで占います'}
      </p>
    </div>
  );
};

export default ArcanaSelector;

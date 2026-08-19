import { useStore } from '../../store/useStore'

export default function ActivityFeed() {
  const activity = useStore((s) => s.activity)

  return (
    <div className="space-y-0">
      {activity.slice(0, 6).map((item, i) => (
        <div key={item.id} className={`flex gap-3 py-3 ${i < 5 ? 'border-b border-linen/80' : ''}`}>
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.tone === 'clay' ? 'bg-clay' : 'bg-forest'}`} />
          <div>
            <p className="text-sm text-espresso leading-snug">{item.text}</p>
            <p className="text-[11px] text-mist mt-1">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

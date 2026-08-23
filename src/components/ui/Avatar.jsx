// export default function Avatar({ member, size = 36, className = '' }) {
//   const px = typeof size === 'number' ? `${size}px` : size
//   const font = Math.max(10, Math.round((typeof size === 'number' ? size : 36) * 0.32))
//   return (
//     <div
//       className={`avatar ${className}`}
//       style={{
//         width: px,
//         height: px,
//         background: member?.bg || '#E9E1D4',
//         color: member?.color || '#1C1917',
//         fontSize: font,
//         boxShadow: `0 0 0 2px ${member?.bg || '#E9E1D4'}`,
//       }}
//       title={member?.name}
//     >
//       {member?.initials || '?'}
//     </div>
//   )
// }

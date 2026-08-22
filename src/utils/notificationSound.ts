const SOUND_MAP: Record<string, string> = {
  default: '/sounds/digitalstore07-bell-notification-430402.mp3',
  soft: '/sounds/digitalstore07-new-message-alert-430414.mp3',
  chime: '/sounds/digitalstore07-sms-notification-430383.mp3',
  arcade: '/sounds/dragon-studio-arcade-sound-431473.mp3',
  level: '/sounds/dragon-studio-level-up-431471.mp3',
  incoming: '/sounds/lucadialessandro-incoming-notification-547634.mp3',
  new: '/sounds/universfield-new-notification-09-352705.mp3',
  sound: '/sounds/universfield-new-notification-036-485897.mp3',
  verse: '/sounds/universfield-new-notification-056-494256.mp3',
  viberating: '/sounds/voicebosch-phone-vibrating-183595.mp3',
}

export function playNotificationSound(soundName = 'default') {
  if (soundName === 'none') return

  const src = SOUND_MAP[soundName] || SOUND_MAP.default
  const audio = new Audio(src)
  audio.volume = 0.6
  audio.play().catch(() => {
    // Browser may block autoplay until user interaction
  })
}
export const QUOTE_ACTION_LABELS = {
  COPY: 'Copy quote',
  SHARE: 'Share quote',
}

export const QUOTE_ACTION_ICONS = {
  COPY: 'copy',
  SHARE: 'share',
}

export const QUOTE_ACTION_ICON_PATHS = {
  [QUOTE_ACTION_ICONS.COPY]: [
    'M11 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z',
    'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  ],
  [QUOTE_ACTION_ICONS.SHARE]: [
    'M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    'M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    'M21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    'M8.59 13.51l6.83 3.98',
    'M15.41 6.51l-6.82 3.98',
  ],
}

export const QUOTE_ACTIONS_CLASSES = 'flex gap-1'

export const QUOTE_ACTION_BUTTON_CLASSES =
  'flex size-11 cursor-pointer items-center justify-center rounded-lg text-body transition-colors duration-fast hover:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus'

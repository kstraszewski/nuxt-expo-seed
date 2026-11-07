export default defineAppConfig({
  ui: {
    colors: { primary: 'cobalt', secondary: 'citron', neutral: 'gray' },
    button: {
      slots: {
        base: 'rounded-none min-h-11 font-medium tracking-[-0.01em] cursor-pointer',
        label: 'truncate',
      },
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'solid',
          class: 'hover:bg-primary active:bg-primary focus-visible:outline-primary',
        },
      ],
    },
    badge: { slots: { base: 'rounded-none font-normal' } },
    card: {
      slots: {
        root: 'rounded-none shadow-none',
        header: 'py-5',
        body: 'p-5 sm:p-7',
        footer: 'py-5',
      },
    },
    input: { slots: { base: 'rounded-none min-h-11' } },
    textarea: { slots: { base: 'rounded-none' } },
    select: { slots: { base: 'rounded-none min-h-11' } },
    alert: {
      slots: { root: 'rounded-none', title: 'font-medium', description: 'leading-relaxed' },
    },
    modal: {
      slots: {
        content: 'rounded-none shadow-xl',
        title: 'text-xl font-medium tracking-tight',
        header: 'py-6',
        footer: 'justify-end',
      },
    },
    header: {
      slots: {
        root: 'static bg-default backdrop-blur-none border-none',
        container: 'border-b border-default',
        title: 'font-semibold tracking-tight',
      },
    },
    footer: { slots: { container: 'border-t border-default py-7' } },
    navigationMenu: { slots: { link: 'rounded-none', linkLabel: 'font-normal' } },
    dashboardSidebar: {
      slots: { root: 'bg-default', header: 'px-6', body: 'px-4 py-6', footer: 'px-6 py-5' },
    },
    dashboardNavbar: {
      slots: { root: 'px-6 sm:px-8 border-default', title: 'font-medium tracking-tight' },
    },
    dashboardPanel: { slots: { body: 'p-5 sm:p-8 lg:p-10 gap-6' } },
    table: {
      slots: {
        root: 'border-y border-default',
        th: 'text-xs font-normal tracking-wide uppercase py-4',
        td: 'py-5',
      },
    },
  },
})

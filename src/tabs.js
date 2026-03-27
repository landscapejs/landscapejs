const tabs = ['npm', 'pnpm', 'yarn', 'bun'];

export function switchTab(selected) {
    tabs.forEach(tab => {
        const btn = document.getElementById('tab-' + tab);
        const panel = document.getElementById('panel-' + tab);

        if (tab === selected) {
            btn.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            btn.classList.add('border-indigo-500', 'text-indigo-600');
            btn.setAttribute('aria-current', 'page');
            panel.classList.remove('hidden');
        } else {
            btn.classList.remove('border-indigo-500', 'text-indigo-600');
            btn.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            btn.removeAttribute('aria-current');
            panel.classList.add('hidden');
        }
    });

    // Sync mobile dropdown
    const select = document.getElementById('tabs');
    if (select) select.value = selected;
}

const 
    app = {
        state: {
            tab: '',
            group: undefined,
            clicked: undefined,
            context: undefined,
            bench: {},
            mode: 'click',
        },
        async copy(message) {
            try {
                await window.navigator.clipboard.writeText(message);
                return true;
            } catch(err) {
                return false
            }
        }
    }

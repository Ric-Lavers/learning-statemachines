/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */



const fetchMachine = Machine({
	id: 'fetch',
	initial: 'idle',
	context: {
		retries: 0
	},
	states: {
		idle: {
			on: {
				FETCH: 'loading'
			}
		},
		loading: {
			on: {
				RESOLVE: 'success',
				REJECT: 'failure'
			}
		},
		success: {
			type: 'final'
		},
		failure: {
			on: {
				RETRY: {
					target: 'loading',
					actions: assign({
						retries: (context, event) => context.retries + 1
					})
				}
			}
		}
	}
});
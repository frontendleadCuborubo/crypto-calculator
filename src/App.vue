<template>
	<div id="app">
		<h1 class="text-center">Crypto Calculator</h1>
		<div class="Calculator-container">
			<div v-if="error" class="Error text-danger text-center">
				{{ error }}
			</div>
			<div v-if="isLoading" class="Loader">
				<div class="Circle-loader"></div>
			</div>
			<Calculator
				:convert-data="convertData"
				:convert-to-symbol="convertToSymbol"
				:coins="coins"
				@load_coin_rate="onLoadCoinRate($event)"
			/>
		</div>
	</div>
</template>

<script>
import { CryptoCompareApi } from './core/CryptoCompareApi';
import Calculator from './components/Calculator.vue';

export default {
	name: 'App',
	components: {
		Calculator
	},
	data: () => {
		return {
			isLoading: false,
			error: '',
			convertData: {},
			convertToSymbol: 'USD',
			coins: [
				{
					symbol: 'BTC',
					icon: 'bitcoin.svg'
				},
				{
					symbol: 'XRP',
					icon: 'ripple.svg'
				},
				{
					symbol: 'ETH',
					icon: 'ethereum.svg'
				},
				{
					symbol: 'LTC',
					icon: 'litecoin.svg'
				}
			]
		};
	},
	mounted() {
		this.doConvertPrice('BTC', this.convertToSymbol);
	},
	methods: {
		onLoadCoinRate(fromSymbol) {
			this.doConvertPrice(fromSymbol, this.convertToSymbol);
		},
		doConvertPrice(fromSymbol, toSymbol) {
			this.isLoading = true;
			this.error = '';
			CryptoCompareApi.convertPriceMulti(fromSymbol, toSymbol)
				.then(resp => this.parseConvertData(resp, fromSymbol))
				.catch(e => (this.error = e))
				.finally(() => setTimeout(() => (this.isLoading = false), 350));
		},
		parseConvertData({ data }, fromSymbol) {
			const { Message } = data;
			/**
			 * This is how Cryptocomare API handle error response
			 */
			if (Message) {
				this.error = Message;
				return;
			}

			this.convertData = {
				fromSymbol,
				rate: data[fromSymbol][this.convertToSymbol]
			};
		}
	}
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap');
#app {
	padding-top: 40px;
}

.Calculator-container {
	position: relative;
	max-width: 370px;
	margin: 0 auto;
}

.Error {
	margin-bottom: 15px;
}

.Loader {
	display: flex;
	align-items: center;
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 1000000;
	background: rgba(255, 255, 255, 0.4);
}

.Circle-loader {
	height: 75px;
	width: 75px;
	margin: 0 auto;
	animation: spin 1s linear infinite;
	border: 3px solid #ddd;
	border-top: 3px solid #42a5f5;
	border-radius: 50%;
}

@-webkit-keyframes spin {
	to {
		border-top-color: #ec407a;
		transform: rotate(360deg);
	}
}

@keyframes spin {
	to {
		border-top-color: #ec407a;
		transform: rotate(360deg);
	}
}
</style>

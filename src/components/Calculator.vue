<template>
	<div class="Calculator">
		<div class="CoinList">
			<div
				class="CoinItem"
				:class="{ active: getIsActive(coin) }"
				v-for="coin in coins"
				:key="coin.symbol"
				@click="onCoinClick(coin)"
			>
				<span class="CoinItem-label">{{ coin.symbol }}</span>
				<div class="CoinItem-body">
					<img :src="require(`@/assets/icons/${coin.icon}`)" alt />
				</div>
			</div>
		</div>
		<div class="form-group">
			<label for="fiat">{{ fiatSymbol }}</label>
			<input
				id="fiat"
				class="form-control"
				v-model.number="fiatValue"
				@input="onFiatInput($event)"
				type="number"
				min="0"
				step="1"
				name="fiat"
			/>
		</div>
		<div class="form-group">
			<label for="coin">{{ getActiveCoinSymbol }}</label>
			<input
				id="coin"
				class="form-control"
				v-model.number="coinValue"
				@input="onCoinInput($event)"
				type="number"
				min="0"
				step="0.1"
				name="coin"
			/>
		</div>
	</div>
</template>

<script>
import roundTo from 'round-to';

export default {
	name: 'Calculator',
	props: {
		convertData: Object,
		fiatSymbol: String,
		coins: Array,
	},
	data: () => {
		return {
			fiatValue: '',
			coinValue: '',
			activeCoin: {
				symbol: '',
				icon: '',
			},
			activeCoinPrice: 0,
		};
	},
	methods: {
		onCoinClick(coin) {
			this.$emit('load_coin_rate', coin.symbol);
		},
		onFiatInput(event) {
			const value = event.target.value;
			this.setCoinValue(value / this.activeCoinPrice);
		},
		onCoinInput(event) {
			const value = event.target.value;
			this.setFiatValue(this.activeCoinPrice * value);
		},
		setFiatValue(value) {
			this.fiatValue = roundTo(value, 2);
		},
		setCoinValue(value) {
			this.coinValue = value;
		},
		getIsActive(coin) {
			return this.activeCoin.symbol === coin.symbol;
		},
	},
	computed: {
		getActiveCoinSymbol() {
			return this.activeCoin.symbol;
		},
	},
	watch: {
		convertData({ coinSymbol, fiatRateData }) {
			const flatRate = fiatRateData[this.fiatSymbol];
			const coin = this.coins.find((coin) => coin.symbol === coinSymbol);
			this.activeCoin = coin;

			if (!this.coinValue) {
				this.setCoinValue(1);
			}

			this.activeCoinPrice = flatRate;
			this.setFiatValue(this.coinValue * flatRate);
		},
	},
};
</script>

<style lang="scss">
.CoinList {
	display: flex;
	justify-content: center;
	margin-bottom: 22px;
}

.CoinItem {
	margin-right: 30px;
	text-align: center;
	&:last-child {
		margin-right: 0;
	}

	&.active {
		.CoinItem-body {
			background: #fff;
		}
	}
}

.CoinItem-label {
	font-family: 'Open Sans';
	font-style: normal;
	font-weight: 600;
	font-size: 10px;
	letter-spacing: 0.04em;
	color: #bbbbbb;
}

.CoinItem-body {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70px;
	height: 46px;
	background: rgba(223, 223, 223, 0.7);
	border: 1px solid #c9c9c9;
	border-radius: 6px;
	cursor: pointer;
}

.form-group {
	text-align: left;
}

label {
	font-family: 'Open Sans';
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: #bbbbbb;
}
</style>

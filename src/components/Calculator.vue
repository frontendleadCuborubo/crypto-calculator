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
			<label for="convert-to">{{ convertToSymbol }}</label>
			<input
				id="convert-to"
				class="form-control"
				v-model.number="convertToValue"
				@input="onConvertToInput($event)"
				type="number"
				min="0"
				step="1"
				name="convert-to"
			/>
		</div>
		<div class="form-group">
			<label for="convert-from">{{ getConvertFromSymbol }}</label>
			<input
				id="convert-from"
				class="form-control"
				v-model.number="convertFromValue"
				@input="onConvertFromInput($event)"
				type="number"
				min="0"
				step="0.1"
				name="convert-from"
			/>
		</div>
	</div>
</template>

<script>
import roundTo from 'round-to';

export default {
	name: 'Calculator',
	props: {
		convertData: {
			type: Object,
			required: true
		},
		convertToSymbol: {
			type: String,
			required: true
		},
		coins: {
			type: Array,
			required: true
		}
	},
	data: () => {
		return {
			convertToValue: '',
			convertFromValue: '',
			activeCoin: {
				symbol: '',
				icon: ''
			},
			activeCoinRate: 0
		};
	},
	methods: {
		onCoinClick(coin) {
			this.$emit('load_coin_rate', coin.symbol.toUpperCase());
		},
		onConvertToInput(event) {
			const value = event.target.value;
			this.setConvertFromValue(value / this.activeCoinRate);
		},
		onConvertFromInput(event) {
			const value = event.target.value;
			this.setConvertToValue(this.activeCoinRate * value);
		},
		setConvertToValue(value) {
			this.convertToValue = roundTo(value, 2);
		},
		setConvertFromValue(value) {
			this.convertFromValue = value;
		},
		getConvertFromValue() {
			return this.convertFromValue;
		},
		getIsActive(coin) {
			return this.activeCoin.symbol === coin.symbol;
		}
	},
	computed: {
		getConvertFromSymbol() {
			return this.activeCoin.symbol;
		}
	},
	watch: {
		convertData({ fromSymbol, rate }) {
			this.activeCoin = {
				...this.coins.find(
					coin =>
						coin.symbol.toLowerCase() === fromSymbol.toLowerCase()
				)
			};

			if (!this.getConvertFromValue()) {
				this.setConvertFromValue(1);
			}

			this.activeCoinRate = rate;
			this.setConvertToValue(this.getConvertFromValue() * rate);
		}
	}
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

var PRICE = 9.99;
var LOAD_NUM = 5;

new Vue({
    el: '#app',

    data: {
        total: 0.00,
        items: [],
        cart: [],
        results: [],
        newsearch: 'dota2',
        lastSearch: '',
        loading: false,
        price: PRICE
    },

    methods: {
        appendItems: function () {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },

        onSubmit: function () {
            if (this.newsearch.length) {
                this.items = [];
                this.loading = true;
                this.$http.get('/search/'.concat(this.newsearch))
                    .then(function (res) {
                        this.lastSearch = this.newsearch;
                        this.results = res.data;
                        this.appendItems();
                        this.loading = false;
                    })
            }
        },

        addItem: function (index) {
            this.total += PRICE;

            var item = this.items[index];
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },

        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },

        dec: function (item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    mounted: function () {
        this.onSubmit();

        var vueInstannce = this; //para conseguir referenciar this.appendItems() no ScrollMonitor
        var elem = document.getElementById('bottom');
        var watcher = scrollMonitor.create(elem);

        watcher.enterViewport(function () {
            vueInstannce.appendItems();
        });
    },

    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },

    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0
        }
    }
});


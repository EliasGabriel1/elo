function EloEvolution(attrs) {

    this._products = {
        f1: { price: 5 }, f2: { price: 5 }, f3: { price: 5 },
        b1: { price: 6 }, b2: { price: 6 }, b3: { price: 6 },
        s1: { price: 10 }, s2: { price: 10 }, s3: { price: 10 },
        g1: { price: 18 }, g2: { price: 18 }, g3: { price: 18 },
        p1: { price: 23 }, p2: { price: 23 }, p3: { price: 23 },
        d1: { price: 42 }, d2: { price: 42 }, d3: { price: 42 },
        a1: { price: 59 }, a2: { price: 59 }, a3: { price: 59 },
        i1: { price: 99 }, i2: { price: 99 }, i3: { price: 180 },
        r1: { price: 1 },
    };

    this._errorMessages = {
        dest_lt_cur: "Nível Desejado é menor que o Atual"
    }

    this._sequence = [
        'f1', 'f2', 'f3',
        'b1', 'b2', 'b3',
        's1', 's2', 's3',
        'g1', 'g2', 'g3',
        'p1', 'p2', 'p3',
        'd1', 'd2', 'd3',
        'a1', 'a2', 'a3',
        'i1', 'i2', 'i3',
        'r1'
    ];

    this.errors = [];

    this.currencyFormat = 'R$ ';
    this.currencyDecimalSeparator = ',';

    this.settings = function(attrs) {
        for (var key in attrs) {
            this[key] = attrs[key];
        }
        this._attachAddToCart();

        return this;
    }

$(document).ready(function() {
    $('#ct').change(function() {
        var src = $(this).find('option:selected').attr('data-img');
        $('img#eloa').attr('src', src);
        $(".form-check-input").prop("checked", false);

    });
    $('#dt').change(function() {
        var src = $(this).find('option:selected').attr('data-img');
        $('img#elof').attr('src', src);
        $(".form-check-input").prop("checked", false);
        opt = $(this).children("option:selected").attr('id');
        if ((opt == 'r')) {
            $('#dd').empty()
                .append('<option selected="selected">1</option>');
        } else {
            $('#dd').empty()
                .append('<option>3</option><option>2</option><option selected="selected">1</option>');
        }
    });
});

    this.change = function() {
        this.ck = $(this.selectCurrentTier).val() + $(this.selectCurrentDivision).val();
        this.dk = $(this.selectDestinationTier).val() + $(this.selectDestinationDivision).val();
        this.current = this._products[this.ck];
        this.destination = this._products[this.dk];

        var price = this.sumValue();
        $(this.priceContainer).text(this._formatCurrency(price));
        $("#preco").val(price);

        $("#price").attr("valor-inicial", price);
        return this;
    }

    this.sumValue = function() {
        this._getSequence();
        if (this.i_dest < this.i_cur) {
            this._addError('dest_gt_cur');
            return false;
        }

        var sum = 0;
        this._execInSequence(function(p, k) {
            sum += p.price;
        });
        return sum;
    }

    this.errorMessages = function() {
        var trErrors = [];
        for (var i = 0; i < this.errors.length; i++) {
            var k = this.errors[i];
            if (this._errorMessages[k]) {
                trErrors.push(this._errorMessages[k]);
            } else {
                trErrors.push(k);
            }
            return trErrors;
        }
    }

    // ============== PRIVATE METHODS ================
    this._getSequence = function() {
        for (var i = 0; i < this._sequence.length; i++) {
            if (this.ck === this._sequence[i]) {
                this.i_cur = i;
            }
            if (this.dk === this._sequence[i]) {
                this.i_dest = i;
            }
        }
    }

    this._execInSequence = function(func) {
        for (var i = this.i_cur; i < this.i_dest; i++) {
            var p_key = this._sequence[i];
            var product = this._products[p_key];
            func(product, p_key);
        }
    }

    this._formatCurrency = function(val) {
        var o = [];
        var decPart = new String(parseInt((val - parseInt(val)) * Math.pow(10, this._currencyDecimalQty)) || 0);
        var intPart = new String(parseInt(val) || 0);
        if (decPart < 10) {
            decPart = "0" + decPart;
        }

        o.push(this.currencyFormat);
        o.push(' ')
        o.push(intPart);

        o.push(this.currencyDecimalSeparator);
        o.push(decPart);

        return o.join('');
    }

    this._attachAddToCart = function() {
        var evo = this;
        $(evo.addToCartButton).click(function() {
            evo.addToCart();
        });
    }

    this._addError = function(err) {
        this.errors.push(err);
    }

    this.init = function(attrs) {
        if (attrs) {
            this.settings(attrs);
        }
    }

    this.init(attrs);
}

$(function() {
    var evo = new EloEvolution({
        selectCurrentTier: '#ct',
        selectCurrentDivision: '#cd',
        selectDestinationTier: '#dt',
        selectDestinationDivision: '#dd',
        priceContainer: '#price',
        priceContainerOriginal: '#priceoriginal'
    }).change();
    $('#ct,#cd,#dt,#dd').change(function() {
        // we need to call inside an anonymous function
        // because we use `this`, inside evo.change function,
        // referring to evo instance, instead the dom object
        // that was changed.
        evo.change();
    });
});
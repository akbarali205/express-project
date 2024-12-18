import moment from 'moment';

export default {
    ifequal(a, b, options) {
        if (a == b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    getName(f, l) {
        return f.charAt(0) + l.charAt(0);
    },
    formatDate(d) {
        return moment(d).format('DD-MMM YYYY')
    }
}
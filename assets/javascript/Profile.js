class Profile {
    constructor(type, obj) {

    }

    get bio() {
        return this.about;
    }

    get stats() {
        if (!this.stats) return false;

        const stats = {};
        if (this.stats.height) {
            stats.height = this.height;
        }
        if (this.stats.weight) {
            stats.weight = this.weight;
        }
        if (this.stats.personality) {
            stats.personality = this.personality;
        }

        return stats
    }

    get name() {

    }
}
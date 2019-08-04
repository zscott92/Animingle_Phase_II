class Profile {
    constructor(obj) {
        this.name = obj.name;
        this.statsFull = obj.stats;
        this.about = obj.about;
        this.raw = obj.raw;
        this.featured = obj.featured;
        this.image_url = obj.image_url;
    }

    get bio() {
        return this.about;
    }

    get stats() {
        if (!this.statsFull) return false;

        const stats = {};
        if (this.statsFull.height) {
            stats.height = this.height;
        }
        if (this.statsFull.weight) {
            stats.weight = this.weight;
        }
        if (this.statsFull.personality) {
            stats.personality = this.personality;
        }

        return stats
    }
}
class Team {
    private members: any[];

    constructor() {
        this.members = [];
    }

    getSize(): number {
        return this.members.length;
    }

}

export { Team }
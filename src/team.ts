class Team {
    private members: any[];

    constructor() {
        this.members = ['T'];
    }

    getSize(): number {
        return this.members.length;
    }

}

export { Team }
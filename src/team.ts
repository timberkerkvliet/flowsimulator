type Perspective = number;

class Member {
    constructor(readonly label: string, readonly perspectives: Perspective[]) {}
}

class Team {
    constructor(private members: Member[]) {}

    getSize(): number {
        return this.members.length;
    }

    getMembers(): Member[] {
        return this.members;
    }

}

export { Team, Member, Perspective }
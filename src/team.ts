type Perspective = number;

class Member {
    constructor(readonly label: string, readonly perspectives: Perspective[]) {}

    hasPerspective(perspective: Perspective): boolean {
        return this.perspectives.some((x) => x === perspective)
    }

}

class Team {
    constructor(private members: Member[]) {}

    getSize(): number {
        return this.members.length;
    }

    getMembers(): Member[] {
        return this.members;
    }

    hasPerspective(perspective: Perspective): boolean {
        return this.members.some((member) => member.hasPerspective(perspective))
    }

}

export { Team, Member, Perspective }
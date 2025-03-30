import { WorkDone } from "./work-done";
import { Team } from "./team";
import { Backlog } from "./backlog";

class Renderer {
    private backlog: HTMLElement;
    private inProgress: HTMLElement;
    private done: HTMLElement;
    private cycleTime: HTMLElement;
    private throughput: HTMLElement;

    constructor() {
        this.backlog = document.getElementById('backlog');
        this.inProgress = document.getElementById('inprogress');
        this.done = document.getElementById('done');
        this.cycleTime = document.getElementById('cycletime');
        this.throughput = document.getElementById('throughput');
    }

    render(team: Team) {
        this.renderBacklog(team.backlog());
        this.renderProgress(team);
        this.renderDone(team.workDone());
        this.renderStats(team.workDone());
    }

    private renderBacklog(workOnBacklog: Backlog) {
        let html = "";
        workOnBacklog.everything().forEach(
            (unit) => {
                html += unit.id().charAt(0)
                html += " ";
            }
        )
        this.backlog.innerHTML = html;
    }

    private renderProgress(team: Team) {
        let html = "<table>";
        team.workInProgress().assignments().forEach(
            (assignment) => {
                html += "<tr><td>"
                assignment.batch().unitsOfWork.forEach(
                    (unit) => {
                        html += unit.id().charAt(0);
                        html += " ";
                    }
                )
                html += "<td>"
                assignment.assignees().forEach(
                    (assignee) => {
                        html += assignee.getValue()
                        html += " "
                    }
                )
                html += "</tr>"
            }
        )
        html += "</tr>"
        this.inProgress.innerHTML = html;
    }

    private renderDone(workDone: WorkDone) {
        let html = "";
        workDone.everything().forEach(
            (unit) => {
                html += unit.id().charAt(0)
                html += " ";
            }
        )
        this.done.innerHTML = html;
    }

    private renderStats(workDone: WorkDone) {
        this.cycleTime.innerHTML = workDone.averageCycleTime().toFixed(3);
        this.throughput.innerHTML = workDone.throughPut().toFixed(3);
    }

}

export { Renderer }
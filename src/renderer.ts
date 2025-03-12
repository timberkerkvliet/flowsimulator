import { Simulation } from "./simulation";
import { WorkDone } from "./work-done";
import { WorkInProgress } from "./work-in-progress";
import { WorkOnBacklog } from "./work-on-backlog";

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

    render(simulation: Simulation) {
        this.renderBacklog(simulation.backlog());
        this.renderProgress(simulation.inProgress());
        this.renderDone(simulation.workDone());
        this.renderStats(simulation.workDone());
    }

    private renderBacklog(workOnBacklog: WorkOnBacklog) {
        let html = "";
        workOnBacklog.everything().forEach(
            (unit) => {
                html += unit.id().charAt(0)
                html += " ";
            }
        )
        this.backlog.innerHTML = html;
    }

    private renderProgress(workInProgress: WorkInProgress) {
        let html2 = "";
        workInProgress.everything().forEach(
            (batch) => {
                batch.unitsOfWork.forEach(
                    (unit) => {
                        html2 += unit.id().charAt(0);
                        html2 += "<br>";
                    }
                )
                
            }
        )
        this.inProgress.innerHTML = html2;
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
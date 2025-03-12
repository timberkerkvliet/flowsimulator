import { Simulation } from "./simulation";

class Renderer {
    private backlog;
    private inProgress;
    private done;
    private cycleTime;
    private throughput;

    constructor() {
        this.backlog = document.getElementById('backlog');
        this.inProgress = document.getElementById('inprogress');
        this.done = document.getElementById('done');
        this.cycleTime = document.getElementById('cycletime');
        this.throughput = document.getElementById('throughput');
    }

    render(simulation: Simulation) {
        let html = "";
        simulation.backlog().everything().forEach(
            (unit) => {
                html += unit.id().charAt(0)
                html += " ";
            }
        )
        this.backlog.innerHTML = html;

        let html2 = "";
        simulation.inProgress().everything().forEach(
            (batch) => {
                batch.unitsOfWork.forEach(
                    (unit) => {
                        html2 += unit.id().charAt(0);
                        html2 += " ";
                    }
                )
                
            }
        )
        this.inProgress.innerHTML = html2;

        html2 = "";
        simulation.workDone().everything().forEach(
            (unit) => {
                html2 += unit.id().charAt(0)
                html2 += " ";
            }
        )
        this.done.innerHTML = html2;

        this.cycleTime.innerHTML = simulation.workDone().averageCycleTime().toFixed(3);
        this.throughput.innerHTML = simulation.workDone().throughPut().toFixed(3);

        // const uowDivs = this.teamDiv.getElementsByTagName('div');

        // let existingIds: string[] = [];

        // for (let i = 0; i < uowDivs.length; i++) {
        //     const childDiv = uowDivs[i];
        //     existingIds.push(childDiv.id);
        // }

        // this.createBoxes(simulation, existingIds);
        // this.removeBoxes(simulation, existingIds);
        // this.updateAssignees(simulation);
        // this.updateColor(simulation);
        // this.moveBoxes(simulation);
        
        // this.updateStats(simulation);

         }
}

export { Renderer }
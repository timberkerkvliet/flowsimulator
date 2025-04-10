import { WorkDone } from "./work-done";
import { Team } from "./team";
import { Backlog } from "./backlog";

function getColorForNumber(n: number): string {
    const COLORS = [
        "#e6194b", // red
        "#3cb44b", // green
        "#0082c8", // blue
        "#f58231", // orange
        "#911eb4", // purple
        "#46f0f0", // cyan
        "#f032e6", // magenta
        "#d2f53c", // lime (borderline but acceptable)
        "#fabebe", // light pink (good contrast)
        "#008080", // teal
      ];
    return COLORS[(n - 1) % COLORS.length];
  }


class Renderer {
    private backlog: HTMLElement;
    private inProgress: HTMLElement;
    private done: HTMLElement;
    private cycleTime: HTMLElement;
    private throughput: HTMLElement;
    private utilization: HTMLElement;

    constructor() {
        this.backlog = document.getElementById('backlog');
        this.inProgress = document.getElementById('inprogress');
        this.done = document.getElementById('done');
        this.cycleTime = document.getElementById('cycletime');
        this.throughput = document.getElementById('throughput');
        this.utilization = document.getElementById('utilization');
    }

    render(team: Team) {
        this.renderBacklog(team.backlog());
        this.renderProgress(team);
        this.renderDone(team.workDone());
        this.renderStats(team.workDone(), team.size.value);
    }

    private renderBacklog(workOnBacklog: Backlog) {
        let html = "<h2>backlog</h2>";
        workOnBacklog.everything().forEach(
            (unit) => {
                const color = unit.isDone() ? 'black' : getColorForNumber(unit.needsMember.value);
                html += `
                    <span
                        class="unitOfWork" style="color: ${color}; border-color: ${color}">
                        ${unit.id.charAt(0)}
                    </span>
                `;
                html += " ";
            }
        )
        this.backlog.innerHTML = html;
    }

    private renderProgress(team: Team) {
        let html = `
            <h2>In Progress</h2>
            <table id="inProgressTable" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 6px;">Batch</th>
                        <th style="text-align: left; padding: 6px;">Assigned</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        team.workInProgress().assignments.forEach(assignment => {
            html += "<tr><td style='padding: 6px;'>";
    
            assignment.batch.unitsOfWork.forEach(unit => {
                const color = unit.isDone() ? 'black' : getColorForNumber(unit.needsMember.value);
                html += `
                    <span
                        class="unitOfWork" style="color: ${color}; border-color: ${color}">
                        ${unit.id.charAt(0)}
                    </span>
                `;
            });
    
            html += "</td><td style='padding: 6px;'>";
    
            assignment.assignees.forEach(assignee => {
                const color = getColorForNumber(assignee.value);
                html += `
                    <span 
                        style="
                            display: inline-block;
                            margin-right: 6px;
                            padding: 2px 6px;
                            border-radius: 4px;
                            background-color: ${color}20;
                            color: ${color};
                            font-weight: bold;
                            font-family: monospace;
                        ">
                        ${assignee.value}
                    </span>
                `;
            });
    
            html += "</td></tr>";
        });
    
        html += `
                </tbody>
            </table>
        `;
    
        this.inProgress.innerHTML = html;
    }
    

    private renderDone(workDone: WorkDone) {
        let html = "<h2>done</h2>";
        workDone.everything().forEach(
            (unit) => {
                html += `
                    <span
                        class="unitOfWork" style="color: black; border-color: black">
                        ${unit.id.charAt(0)}
                    </span>
                `;
                html += " ";
            }
        )
        this.done.innerHTML = html;
    }

    private renderStats(workDone: WorkDone, teamSize: number) {
        const throughPut = workDone.throughPut();
        this.cycleTime.innerHTML = workDone.averageCycleTime().toFixed(3);
        this.throughput.innerHTML = throughPut.toFixed(3);
        this.utilization.innerHTML = (workDone.utilization()*100/teamSize).toFixed(1) + "%"
        
    }

}

export { Renderer }
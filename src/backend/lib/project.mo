import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import ProjectTypes "../types/project";
import Common "../types/common";

module {
  public func add(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    nextId : { var val : Common.ProjectId },
    input : ProjectTypes.ProjectInput,
  ) : ProjectTypes.ProjectRecord {
    let id = nextId.val;
    nextId.val += 1;
    let now = Time.now();
    let record : ProjectTypes.ProjectRecord = {
      id;
      title = input.title;
      category = input.category;
      description = input.description;
      requirements = input.requirements;
      deadline = input.deadline;
      budget = input.budget;
      status = input.status;
      assignedCandidates = [];
      createdAt = now;
      updatedAt = now;
    };
    projects.add(id, record);
    record;
  };

  public func update(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    projectId : Common.ProjectId,
    input : ProjectTypes.ProjectInput,
  ) : ProjectTypes.ProjectRecord {
    let existing = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("Project not found");
    };
    let updated : ProjectTypes.ProjectRecord = {
      existing with
      title = input.title;
      category = input.category;
      description = input.description;
      requirements = input.requirements;
      deadline = input.deadline;
      budget = input.budget;
      status = input.status;
      updatedAt = Time.now();
    };
    projects.add(projectId, updated);
    updated;
  };

  public func listAll(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
  ) : [ProjectTypes.ProjectRecord] {
    projects.values().toArray();
  };

  public func getById(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    projectId : Common.ProjectId,
  ) : ?ProjectTypes.ProjectRecord {
    projects.get(projectId);
  };

  public func getForCandidate(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    candidatePrincipal : Principal,
  ) : [ProjectTypes.ProjectRecord] {
    let filtered = List.empty<ProjectTypes.ProjectRecord>();
    for ((_, project) in projects.entries()) {
      let assigned = project.assignedCandidates.find(func(p : Principal) : Bool {
        Principal.equal(p, candidatePrincipal)
      });
      switch (assigned) {
        case (?_) filtered.add(project);
        case null {};
      };
    };
    filtered.toArray();
  };

  public func assignCandidate(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    projectId : Common.ProjectId,
    candidatePrincipal : Principal,
  ) {
    let existing = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("Project not found");
    };
    // Avoid duplicates
    let alreadyAssigned = existing.assignedCandidates.find(func(p : Principal) : Bool {
      Principal.equal(p, candidatePrincipal)
    });
    switch (alreadyAssigned) {
      case (?_) {}; // already there, nothing to do
      case null {
        let updated : ProjectTypes.ProjectRecord = {
          existing with
          assignedCandidates = existing.assignedCandidates.concat([candidatePrincipal]);
          updatedAt = Time.now();
        };
        projects.add(projectId, updated);
      };
    };
  };

  public func deleteProject(
    projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
    projectId : Common.ProjectId,
  ) {
    projects.remove(projectId);
  };
};

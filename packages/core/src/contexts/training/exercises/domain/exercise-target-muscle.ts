import { MuscleGroup } from "./muscle-group";
import { MuscleInvolvement } from "./muscle-involvement";

export type ExerciseTargetMusclePrimitives = {
  muscleGroup: string;
  involvement: string;
};

export class ExerciseTargetMuscle {
  constructor(
    public readonly muscleGroup: MuscleGroup,
    public readonly involvement: MuscleInvolvement,
  ) {}

  static fromPrimitives(
    p: ExerciseTargetMusclePrimitives,
  ): ExerciseTargetMuscle {
    return new ExerciseTargetMuscle(
      new MuscleGroup(p.muscleGroup),
      new MuscleInvolvement(p.involvement),
    );
  }

  toPrimitives(): ExerciseTargetMusclePrimitives {
    return {
      muscleGroup: this.muscleGroup.value,
      involvement: this.involvement.value,
    };
  }

  equals(other: ExerciseTargetMuscle): boolean {
    return (
      this.muscleGroup.equals(other.muscleGroup) &&
      this.involvement.equals(other.involvement)
    );
  }
}

import { factorizeSumType } from "./factories.js";

export const Step = factorizeSumType("Step", {
  Done: [ 'value' ],
  Loop: [ 'value' ]
});

Step.prototype.alt = Step.prototype["fantasy-land/alt"] = function (container) {

  return this.fold({
    Done: _ => container,
    Loop: _ => this
  });
};

export const Done = Step.Done;
export const Loop = Step.Loop;

export default Step;

import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB } from './transcript.service.ts';

describe('additional mutation killing test', () => {
  let service: TranscriptDB;
  beforeEach(() => {
    service = new TranscriptDB();
  });
  // Line 40 (AssignmentOperator: `_lastID += 1` -> `_lastID -= 1`): NON-INNOCUOUS.
  it(' line 40: addStudent should return a positive ID', () => {
    const id = service.addStudent('su');
    expect(id).toBeGreaterThan(0);
  });
  // Line 43 (ArrayDeclaration: `grades: []` -> `grades: ["Stryker was here"]`): NON-INNOCUOUS.
  it('line 43: initialize the list of grades should be empty', () => {
    const id = service.addStudent('su');
    expect(service.getTranscript(id).grades).toEqual([]);
  });
  // Lines 53 & 54 (MethodExpression: filter removed; ConditionalExpression: `filter(t => true)`):
  it('line 53&54: nameToIDs should return only the IDs of students with the given name', () => {
    const id1 = service.addStudent('su');
    const id2 = service.addStudent('su');
    const id3 = service.addStudent('su');
    const id4 = service.addStudent('du');
    expect(service.nameToIDs('su')).toEqual([id1, id2, id3]);
    expect(service.nameToIDs('du')).toEqual([id4]);
  });
  // Line 70 (StringLiteral: error message -> ``): treated as NON-INNOCUOUS.
  it('line 70: when the id is invalid, it should throw a error message', () => {
    expect(() => service._getIndexForId(9)).toThrow('Transcript not found for student with ID 9');
  });
  // Line 121 (ConditionalExpression: `find(grade => true)`): NON-INNOCUOUS.
  it('line 121: given a valid student id and a course should be able ponit to a valid grade', () => {
    const id1 = service.addStudent('su');
    service.addGrade(id1, 'cs435', 90);
    service.addGrade(id1, 'cs405', 70);
    expect(service.getGrade(id1, 'cs405')).toEqual({ course: 'cs405', grade: 70 });
  });
  // Line 125 (StringLiteral: error message -> ``): treated as NON-INNOCUOUS, same reasoning
  it('line 125: given an invalid student id and a course throw the error', () => {
    const id1 = service.addStudent('su');
    const courseName = 'cs435';
    service.addGrade(id1, courseName, 90);
    expect(() => service.getGrade(id1, 'cs101')).toThrow(
      `Grades for course cs101 not found for student su (ID: ${id1})`,
    );
  });
});

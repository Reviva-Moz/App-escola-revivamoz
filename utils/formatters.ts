
import { GradeRecord } from '@/types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const calculateAverage = (gradeRecord: GradeRecord | undefined): number | null => {
    if (!gradeRecord) return null;
    const notes = [gradeRecord.nota1, gradeRecord.nota2, gradeRecord.finalExam];
    const validNotes = notes.map(n => parseFloat(String(n))).filter(n => !isNaN(n) && n >= 0 && n <= 20);
    
    if (validNotes.length === 0) return null;
    
    const sum = validNotes.reduce((acc, curr) => acc + curr, 0);
    return sum / validNotes.length;
};
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Header';
import DataTable from '../components/DataTable';
import { Student } from '../types';
import { PlusIcon, PencilIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../utils/supabase';
import { STUDENTS_DATA } from '../constants'; // Keep for fallback

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (supabase) {
        // --- Supabase path ---
        const { data, error } = await supabase
          .from('students')
          .select('*, classes(name)') // Use a JOIN to get the class name
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching students:', error);
          setError('Não foi possível carregar os alunos do banco de dados.');
        } else {
          // Map Supabase data (snake_case) to our component's expected type (camelCase)
          const formattedData: Student[] = data.map(student => ({
            id: student.id,
            name: student.name,
            age: student.age,
            guardian: student.guardian,
            phone: student.phone,
            status: student.status,
            classId: student.class_id,
            class: (student.classes as { name: string })?.name || 'N/A',
          }));
          setStudents(formattedData);
        }
      } else {
        // --- Fallback to mock data path ---
        console.warn("Supabase not configured. Falling back to mock data for Students.");
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network
        setStudents(STUDENTS_DATA);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredStudents = useMemo(() => 
    students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, students]
  );

  const actionButtons = (studentId: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <Button 
        variant="link"
        onClick={() => navigate(`/alunos/${studentId}/editar`)}
        aria-label={`Editar aluno`}
        >
         <PencilIcon className="h-4 w-4 mr-1"/> Editar
      </Button>
      <Button variant="link" className="text-reviva-green hover:text-reviva-green-dark">
        <DocumentDuplicateIcon className="h-4 w-4 mr-1"/> Gerar Doc.
      </Button>
    </div>
  );

  const studentRows = filteredStudents.map((student: Student) => [
    <span className="font-medium text-gray-900 dark:text-gray-200">{student.name}</span>,
    student.class,
    student.age,
    student.guardian,
    student.phone,
    <Badge variant={student.status === 'Ativo' ? 'success' : 'default'}>{student.status}</Badge>,
    actionButtons(student.id)
  ]);
  
  return (
    <>
      <PageHeader title="Gestão de Alunos" subtitle="Lista completa de todos os alunos matriculados">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                id="search-students"
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
            />
            <Button
              onClick={() => navigate('/alunos/novo')}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Cadastrar Aluno
            </Button>
        </div>
      </PageHeader>
      
      {loading ? (
         <div className="text-center py-8">A carregar alunos...</div>
      ) : error ? (
         <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
         <DataTable
            title="Alunos Matriculados"
            headers={['Nome', 'Classe', 'Idade', 'Encarregado', 'Telefone', 'Status', 'Ações']}
            rows={studentRows}
          />
      )}
    </>
  );
};

export default Students;
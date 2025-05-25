// Тест для компонента TaskCard

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';
import type { Task } from '../hooks/useTasks';

// Mock Task data
const mockTaskIncomplete: Task = {
  id: '1',
  title: 'Test Task Title',
  description: 'This is a test description for the task.',
  deadline: '2025-12-31T10:00:00',
  completed: false,
};

const mockTaskCompleted: Task = {
  id: '2',
  title: 'Completed Task',
  description: 'This task has been completed.',
  deadline: '2025-11-30T15:30:00',
  completed: true,
};

const mockTaskLongText: Task = {
    id: '3',
    title: 'This is a very long task title that definitely exceeds the one hundred character limit and should be truncated by the component',
    description: 'This is an extremely long task description that goes well beyond the one hundred and fifty character limit imposed by the TaskCard component, so we expect it to be truncated with an ellipsis at the end.',
    deadline: '2025-10-10T00:00:00', // Added deadline to avoid issues with formatting undefined
    completed: false,
};


describe('TaskCard Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnToggleComplete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnDelete.mockClear();
    mockOnToggleComplete.mockClear();
    mockOnEdit.mockClear();
  });

  test('renders incomplete task correctly', () => {
    render(
      <TaskCard
        task={mockTaskIncomplete}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(mockTaskIncomplete.title)).toBeInTheDocument();
    expect(screen.getByText(mockTaskIncomplete.description!)).toBeInTheDocument();
    expect(screen.getByText('2025-12-31')).toBeInTheDocument(); // Formatted date
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByText(mockTaskIncomplete.title)).not.toHaveStyle('text-decoration: line-through');
  });

  test('renders completed task correctly', () => {
    render(
      <TaskCard
        task={mockTaskCompleted}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(mockTaskCompleted.title)).toBeInTheDocument();
    expect(screen.getByText(mockTaskCompleted.description!)).toBeInTheDocument();
    expect(screen.getByText('2025-11-30')).toBeInTheDocument(); // Formatted date
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText(mockTaskCompleted.title)).toHaveStyle('text-decoration: line-through');
  });

  test('calls onToggleComplete when checkbox is clicked', () => {
    render(
      <TaskCard
        task={mockTaskIncomplete}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggleComplete).toHaveBeenCalledWith(mockTaskIncomplete.id);
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTaskIncomplete}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    // Targeting the edit button by its aria-label or role if more specific selectors are needed.
    // For MUI, IconButton often wraps an SVG icon. We can find the button by its role and then check its contents or order.
    // Let's assume the edit button is the first IconButton and delete is the second.
    const buttons = screen.getAllByRole('button');
    // Find the button that contains an EditIcon. This is more robust.
    const editButton = buttons.find(button => button.querySelector('[data-testid="EditIcon"]'));
    expect(editButton).toBeInTheDocument();
    if (editButton) {
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTaskIncomplete);
    }
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTaskIncomplete}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    const buttons = screen.getAllByRole('button');
    // Find the button that contains a DeleteIcon.
    const deleteButton = buttons.find(button => button.querySelector('[data-testid="DeleteIcon"]'));
    expect(deleteButton).toBeInTheDocument();
    if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith(mockTaskIncomplete.id);
    }
  });

  test('renders task without description if not provided', () => {
    const taskWithoutDescription = { ...mockTaskIncomplete, description: undefined };
    render(
      <TaskCard
        task={taskWithoutDescription}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText(taskWithoutDescription.title)).toBeInTheDocument();
    expect(screen.queryByText(mockTaskIncomplete.description!)).not.toBeInTheDocument();
  });

  test('renders task without deadline if not provided', () => {
    const taskWithoutDeadline = { ...mockTaskIncomplete, deadline: undefined };
    render(
      <TaskCard
        task={taskWithoutDeadline}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    expect(screen.getByText(taskWithoutDeadline.title)).toBeInTheDocument();
    expect(screen.queryByText('2025-12-31')).not.toBeInTheDocument();
    expect(screen.queryByTestId('CalendarMonthIcon')).not.toBeInTheDocument();
  });

  test('truncates long title and description', () => {
    render(
      <TaskCard
        task={mockTaskLongText}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
      />
    );
    
    const expectedTruncatedTitle = mockTaskLongText.title.substring(0, 100) + '...';
    const expectedTruncatedDescription = mockTaskLongText.description!.substring(0, 150) + '...';

    expect(screen.getByText(expectedTruncatedTitle)).toBeInTheDocument();
    expect(screen.getByText(expectedTruncatedDescription)).toBeInTheDocument();
  });

  test('formats deadline date correctly', () => {
    render(
        <TaskCard
            task={mockTaskIncomplete}
            onDelete={mockOnDelete}
            onToggleComplete={mockOnToggleComplete}
            onEdit={mockOnEdit}
        />
    );
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    expect(screen.queryByText(mockTaskIncomplete.deadline!)).not.toBeInTheDocument(); // Ensure raw ISO string is not rendered
  });

});

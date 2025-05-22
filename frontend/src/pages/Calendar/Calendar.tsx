import React, { useState, useEffect } from 'react';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import { useCalendar } from '../../hooks/useCalendar';
import { usePageTitle } from '../../context/PageTitleContext';

import {
  TextField,
  IconButton,
  Dialog,
  useMediaQuery,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateField } from '@mui/x-date-pickers/DateField';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ru } from 'date-fns/locale';

import styles from './Calendar.module.scss';
import { useTheme } from '@mui/material/styles';

export const Calendar = () => {
  const { setTitle, setSubtitle } = usePageTitle();

  useEffect(() => {
        setTitle(`Календарь`);
        setSubtitle(``);
    }, [setTitle, setSubtitle]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  const { tasks, projects, loading } = useCalendar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isSameDay = (dateStr: string, selected: Date | null) => {
    if (!selected) return false;
    return new Date(dateStr).toDateString() === selected.toDateString();
  };

  const filteredTasks = tasks.filter(task => isSameDay(task.deadline, selectedDate));
  const filteredProjects = projects.filter(project => isSameDay(project.deadline, selectedDate));

  if (loading) return <p className={styles.loading}>Загрузка...</p>;

  return (
    <div className={styles.calendarPage}>
      <div className={styles.calendarContent}>
        <div className={styles.calendarLayout}>
          <div className={styles.leftColumn}>
            <section className={styles.calendarSection}>
              <h2>Задачи</h2>
              <div className={styles.cardGrid}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <p className={styles.empty}>Нет задач на выбранную дату</p>
                )}
              </div>
            </section>

            <section className={styles.calendarSection}>
              <h2>Проекты</h2>
              <div className={styles.cardGrid}>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <p className={styles.empty}>Нет проектов на выбранную дату</p>
                )}
              </div>
            </section>
          </div>

          <div className={styles.rightColumn}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <div className={styles.datepickerWrapper}>
                {isMobile ? (
                  <>
                    <IconButton onClick={() => setMobileOpen(true)}>
                      <CalendarTodayIcon />
                    </IconButton>
                    <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} fullWidth>
                      <Box p={2}>
                        <DateCalendar
                          value={selectedDate}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                            setMobileOpen(false);
                          }}
                        />
                      </Box>
                    </Dialog>
                  </>
                ) : (
                  <div>
                    <DateField
                      label="Дата"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      format="dd.MM.yyyy"
                      sx={{ marginBottom: 2, width: '100%' }}
                    />
                    <DateCalendar
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                    />
                  </div>
                )}
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
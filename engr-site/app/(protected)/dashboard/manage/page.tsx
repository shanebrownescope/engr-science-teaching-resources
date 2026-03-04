"use client";

import { CreateCourseSchema } from "@/schemas";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { fetchCourses } from "@/actions/fetching/courses/fetchCourses";
import { FormattedData } from "@/utils/formatting";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import styles from "@/styles/form.module.css";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import updateCourse from "@/actions/update/updateCourse";
import deleteCourse from "@/actions/delete/deleteCourse";

type FormFields = z.infer<typeof CreateCourseSchema>;

const ManageCourses = () => {
  useRequireAuth();

  const router = useRouter();
  const role = useCurrentRole();
  if (role != "admin") {
    console.log("-- not admin");
    router.push("/unauthorized");
  }

  const [courses, setCourses] = useState<FormattedData[]>([]);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<FormattedData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      courseName: "",
    },
    resolver: zodResolver(CreateCourseSchema),
  });

  // Load all courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await fetchCourses();
        if (coursesData.success) {
          setCourses(coursesData.success);
        } else if (coursesData.failure) {
          setError(coursesData.failure);
        }
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!editingCourse) return;

    setFormError("root", { message: "" });
    setSuccess("");
    setError("");

    try {
      const results = await updateCourse({ 
        id: editingCourse.id.toString(), 
        courseName: data.courseName 
      });

      if (results.error) {
        setFormError("root", { message: results.error });
      } else if (results.success) {
        setSuccess(results.success);
        reset({ courseName: "" });
        setEditingCourse(null);
        
        // Refresh courses list
        const coursesData = await fetchCourses();
        if (coursesData.success) {
          setCourses(coursesData.success);
        }
      }
    } catch (error) {
      setFormError("root", { message: "Error updating course" });
      console.log(error);
    }
  };

  const handleEdit = (course: FormattedData) => {
    setEditingCourse(course);
    reset({ courseName: course.name });
    setSuccess("");
    setError("");
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    reset({ courseName: "" });
    setSuccess("");
    setError("");
  };

  const handleDelete = async (courseId: string, courseName: string) => {
    const confirmMessage = `Are you sure you want to delete "${courseName}"? This action cannot be undone and may affect related course topics and resources.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setError("");
    setSuccess("");
    
    try {
      const result = await deleteCourse(courseId);
      
      if (result.success) {
        setSuccess(result.success);
        // Refresh the course list
        const updatedCourses = courses.filter(course => course.id.toString() !== courseId);
        setCourses(updatedCourses);
        
        // Clear edit mode if deleting the course being edited
        if (editingCourse && editingCourse.id.toString() === courseId) {
          handleCancelEdit();
        }
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to delete course");
      console.error(err);
    }
  };

  return (
    <div className={styles.formAdminWrapper}>
      <p className={styles.formAdminTitle}>Manage Courses</p>
      
      {/* Edit Course Form - Only show when editing */}
      {editingCourse && (
        <div className={styles.editSection}>
          <h3 className={styles.sectionTitle}>Edit Course: {editingCourse.name}</h3>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-col">
              <label>Course Name</label>
              <input
                className={errors.courseName ? "input-error" : ""}
                {...register("courseName")}
                type="text"
                placeholder="Enter course name"
                disabled={isSubmitting}
              />
              {errors.courseName && (
                <p className="error">{errors.courseName.message}</p>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={styles.formButton}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Course"}
              </button>
            </div>

            {errors.root && <FormError message={errors.root.message} />}
          </form>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && <FormSuccess message={success} />}
      {error && <FormError message={error} />}

      {/* Existing Courses List */}
      <div className={styles.existingCoursesSection}>
        <h3 className={styles.sectionTitle}>
          {editingCourse ? "All Courses" : "Existing Courses"}
        </h3>
        
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className={styles.courseList}>
            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              courses.map((course) => (
                <div 
                  key={course.id} 
                  className={`${styles.courseItem} ${
                    editingCourse?.id === course.id ? styles.courseItemEditing : ""
                  }`}
                >
                  <div className={styles.courseInfo}>
                    <div className={styles.courseName}>{course.name}</div>
                    <div className={styles.courseId}>ID: {course.id}</div>
                  </div>
                  <div className={styles.courseActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(course)}
                      disabled={isSubmitting}
                    >
                      {editingCourse?.id === course.id ? "Editing..." : "Edit"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(course.id.toString(), course.name)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Navigation Helper */}
      <div className={styles.navigationHelper}>
        <p>
          Want to create a new course? 
          <button 
            className={styles.linkButton}
            onClick={() => router.push('/admin/add-content/courses')}
          >
            Go to Create Course
          </button>
        </p>
      </div>
    </div>
  );
};

export default ManageCourses;
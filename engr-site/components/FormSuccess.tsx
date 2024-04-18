import styles from '@/styles/form.module.css'

type FormSuccessProps = {
    message?: string;
}

export const FormSuccess = ({
  message
}: FormSuccessProps) => {

  if (!message) {
    return null;
  }

  return (
    <div className={styles.formSuccess}>
      <p> {message} </p>
    </div>
  )
}


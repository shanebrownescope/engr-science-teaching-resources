import styles from '@/styles/testAuth.module.css'

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


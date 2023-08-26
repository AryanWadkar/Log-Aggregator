import styles from './graph.module.css'
import { CChart } from '@coreui/react-chartjs'

function GraphsSection({entries, isLoading,err}) {

  const customerCounts = {};

  for (const obj of entries) {
      if (obj.hasOwnProperty("customerId")) {
          const customerId = obj.customerId;
          if (customerCounts.hasOwnProperty(customerId)) {
              customerCounts[customerId]++;
          } else {
              customerCounts[customerId] = 1;
          }
      }
  }

    return (
      <div className={styles.graphssection}>
        {err?<div>An error has occurred</div>:isLoading?<div>Loading...</div>:
          <CChart
          className={styles.chart}
          type="bar"
          data={{
            labels: Object.keys(customerCounts),
            datasets: [
              {
                label: 'Traces logged',
                data: Object.values(customerCounts),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1
              },
            ],
          }}
          labels="Sources"
        />
        }
      </div>
    );
  }

  export default GraphsSection;
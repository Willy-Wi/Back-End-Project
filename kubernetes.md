## Installing kubectl
First, check if kubectl is already installed on your local machine by running:
```bash
kubectl
```
if it returns an error, you don't have kubectl installed.

You can download kubectl using the installation guide that can be found here [Install and Set Up kubectl on Windows | Kubernetes](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/).
## Installing Minikube
Minikube is a lightweight Kubernetes implementation that allows you to run a single-node Kubernetes cluster on your local machine. It is a great tool for developers and beginners to learn Kubernetes, experiment with applications, and test deployments without needing access to a full-fledged Kubernetes cluster.

If you are on Windows, you can download it from the Windows Package Manager.
```powershell
winget install minikube
```
Or you can download it using Chocolatey.
```bash
choco install minikube
```
## Starting Minikube
Start Minikube by running the following command.
```bash
minikube start
```
## Creating the YAML files
If you use Visual Studio Code, you can simplify the process by installing Kubernetes extension.
You just need to type 'Deployment' in the editor, a snippet suggestion will pop up, and just press enter.

Create a file named **mysql-deployment.yaml** with the following content:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: popsicle-mysql
spec:
  selector:
    matchLabels:
      app: popsicle-mysql
  template:
    metadata:
      labels:
        app: popsicle-mysql
    spec:
      containers:
      - name: popsicle-mysql
        image: willywijayaa/popsicle-mysql:1.0
        env:
        - name: MYSQL_DATABASE
          value: popsicle
        - name: MYSQL_ROOT_PASSWORD
          value: password
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
        ports:
        - containerPort: 3306
```
Create a file named **node-app-devlopment.yaml** with the following content:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: popsicle-node
spec:
  selector:
    matchLabels:
      app: popsicle-node
  template:
    metadata:
      labels:
        app: popsicle-node
    spec:
      containers:
      - name: popsicle-node
        image: willywijayaa/popsicle:1.0
        env:
        - name: DB_HOST
          value: popsicle-mysql
        - name: DB_USER
          value: root
        - name: DB
          value: popsicle
        - name: DB_PASSWORD
          value: password
        - name: DB_PORT
          value: "3306"
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 3000
```
Create a file named **services.yaml** with the following content:
```yaml
## services.yaml
apiVersion: v1
kind: Service
metadata:
  name: popsicle-mysql
spec:
  selector:
    app: popsicle-mysql
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306

---

apiVersion: v1
kind: Service
metadata:
  name: popsicle-app
spec:
  selector:
    app: popsicle-app
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: NodePort
```
## Applying the YAML configurations
Apply the configuration files:
```bash
kubectl apply -f mysql-deployment.yaml
kubectl apply -f node-app-deployment.yaml
kubectl apply -f services.yaml
```
You can view the pods created by running the following command.
```bash
kubectl get pods
```
```bash
NAME                              READY   STATUS    RESTARTS   AGE
popsicle-mysql-56457ffc49-d4tjl   1/1     Running   0          10m
popsicle-node-64684f64cd-2wzs6    1/1     Running   0          10m
```
It shows that the `Pod` has a `STATUS` of `Running` which means it's running correctly, However, it may show a different `STATUS`. Here are some of the following `STATUS`:
- `Running`: This indicates that the container is running and healthy. All its processes are operational and the pod is ready to serve requests.
- `Terminating`: This means the container is being stopped gracefully. It will be terminated after completing any ongoing tasks.
- `ContainerCreation`: This is the initial stage where the Kubernetes runtime is creating the container. It involves pulling the image, setting up the environment, and starting the container process.
- `CrashLoopBackOff`: This state occurs when the container crashes and restarts repeatedly. Kubernetes attempts to restart the container with increasing delays between attempts. This usually indicates an error in the container image or configuration that needs to be addressed.
- `Pending`: The pod is waiting for resources to be allocated before it can be scheduled onto a node.

You can also view the `Deployments` and `Services` with the following command.
```bash
kubectl get deployments
kubectl get services
```
## Accessing the Node App
If your pods are running correctly, you can run the following command to view the running app which is our node app.
```bash
minikube service popsicle-node
```

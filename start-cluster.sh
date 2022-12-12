EKSCTL_CLUSTER_NAME=$1 \
&& EKSCTL_DRIVER_ROL_NAME=AmazonEKS_EBS_CSIDriverRole$EKSCTL_CLUSTER_NAME \
&& IAM_ID=$(aws sts get-caller-identity --query "Account" --output text)  \
&& eksctl create cluster \
--name $EKSCTL_CLUSTER_NAME \                                                           --version 1.24 \
--region us-east-2 \
--node-type t3.medium \
--nodes 3 \
&& eksctl utils associate-iam-oidc-provider --cluster $EKSCTL_CLUSTER_NAME --approve \
&& eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster $EKSCTL_CLUSTER_NAME \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --role-only \
  --role-name $EKSCTL_DRIVER_ROL_NAME \
&& eksctl create addon --name aws-ebs-csi-driver --cluster $EKSCTL_CLUSTER_NAME --service-account-role-arn arn:aws:iam::$IAM_ID:role/$EKSCTL_DRIVER_ROL_NAME --force